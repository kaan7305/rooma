'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { allProperties, type Property } from '@/data/properties';
import { MapPin, Star, Bed, Bath, Users, Ruler, Check, Heart, Share2, Calendar, MessageCircle } from 'lucide-react';
import { useBookingsStore } from '@/lib/bookings-store';
import { useAuthStore } from '@/lib/auth-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useMessagesStore } from '@/lib/messages-store';
import { useNotificationsStore } from '@/lib/notifications-store';
import PropertyGallery from '@/components/PropertyGallery';
import ReviewsSection from '@/components/ReviewsSection';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const { user, isAuthenticated } = useAuthStore();
  const { addBooking } = useBookingsStore();
  const { isFavorite, addFavorite, removeFavorite, loadFavorites } = useFavoritesStore();
  const { createConversation, loadMessages: loadMessagesStore } = useMessagesStore();
  const { addNotification } = useNotificationsStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    // Simulate loading and find property from dummy data
    const propertyId = Number(params.id);
    const foundProperty = allProperties.find((p) => p.id === propertyId);

    setTimeout(() => {
      setProperty(foundProperty || null);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleBooking = () => {
    if (!isAuthenticated || !user) {
      alert('Please log in to make a booking');
      router.push('/auth/login');
      return;
    }

    if (!property) return;

    // Calculate total price based on days
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const monthlyRate = property.price;
    const dailyRate = monthlyRate / 30;
    const totalPrice = Math.round(dailyRate * days);

    // Create booking
    addBooking({
      propertyId: property.id,
      property: property,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    // Send notification
    addNotification({
      userId: user.id,
      type: 'booking',
      title: 'Booking Confirmed!',
      message: `Your booking for "${property.title}" has been confirmed. Check-in: ${new Date(checkIn).toLocaleDateString()}`,
      actionUrl: '/bookings',
    });

    // Show success message and redirect
    alert(`Booking confirmed! Total: $${totalPrice.toLocaleString()} for ${days} day${days > 1 ? 's' : ''}`);
    router.push('/bookings');
  };

  const toggleFavorite = () => {
    if (!property) return;
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property.id);
    }
  };

  const handleContactHost = () => {
    if (!isAuthenticated || !user) {
      alert('Please log in to contact the host');
      router.push('/auth/login');
      return;
    }

    if (!property) return;

    // Create or get existing conversation
    loadMessagesStore();
    const conversationId = createConversation({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.image,
      participant1Id: user.id,
      participant1Name: `${user.first_name} ${user.last_name}`,
      participant1Initials: `${user.first_name[0]}${user.last_name[0]}`,
      participant2Id: 999, // Dummy host ID
      participant2Name: 'John Doe',
      participant2Initials: 'JD',
    });

    router.push(`/messages/${conversationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Property not found</h3>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = property.rating;
  const totalReviews = property.reviews;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Title and Actions */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {property.title}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={toggleFavorite}
                className="p-3 rounded-full hover:bg-white transition-colors shadow-md bg-white/80 backdrop-blur-sm"
              >
                <Heart className={`w-5 h-5 ${property && isFavorite(property.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
              </button>
              <button className="p-3 rounded-full hover:bg-white transition-colors shadow-md bg-white/80 backdrop-blur-sm">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{avgRating}</span>
              <span>({totalReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <PropertyGallery
          images={property.images || [property.image]}
          title={property.title}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info Card */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Property details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Bed className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.beds}</p>
                    <p className="text-sm text-gray-600">Bedroom{property.beds > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <Bath className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.baths}</p>
                    <p className="text-sm text-gray-600">Bathroom{property.baths > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2-4</p>
                    <p className="text-sm text-gray-600">Guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <Ruler className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.sqft}</p>
                    <p className="text-sm text-gray-600">sq ft</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
              <div className="mt-6 flex items-center gap-2">
                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                  {property.type}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {property.available}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-rose-600" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <ReviewsSection propertyId={property.id} />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-24 border border-gray-100">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    ${property.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-emerald-600 font-medium">{property.available}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!checkIn || !checkOut}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request to Book
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>

              {/* Host Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Hosted by</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Verified Host
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleContactHost}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-rose-500 text-rose-600 rounded-xl hover:bg-rose-50 transition font-semibold"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Host
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold"
          >
            ← Back to search results
          </Link>
        </div>
      </div>
    </div>
  );
}
