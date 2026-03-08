'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import {
  ArrowLeftRight,
  MapPin,
  Calendar,
  Users,
  Home,
  MessageCircle,
  Star,
  Filter,
  Heart,
  Clock,
  Globe
} from 'lucide-react';

interface ExchangePlace {
  id: string;
  hostName: string;
  hostAvatar: string;
  hostUniversity: string;
  location: string;
  country: string;
  propertyType: string;
  duration: string;
  availableFrom: string;
  availableTo: string;
  description: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  rating: number;
  reviewCount: number;
  familyMembers: number;
  lookingFor: string;
  exchangeType: 'home' | 'family' | 'both';
}

export default function ExchangePlacesPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedExchangeType, setSelectedExchangeType] = useState<'all' | 'home' | 'family' | 'both'>('all');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [selectedPlace, setSelectedPlace] = useState<ExchangePlace | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Dummy exchange places data
  const exchangePlaces: ExchangePlace[] = [
    {
      id: '1',
      hostName: 'Maria Garcia',
      hostAvatar: 'MG',
      hostUniversity: 'Universidad Complutense de Madrid',
      location: 'Madrid',
      country: 'Spain',
      propertyType: 'Apartment',
      duration: '1-2 weeks',
      availableFrom: '2026-06-01',
      availableTo: '2026-08-31',
      description: 'Cozy apartment in the heart of Madrid. Perfect for students wanting to experience Spanish culture. My family loves hosting international students!',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      amenities: ['WiFi', 'Kitchen', 'Laundry', 'AC', 'Study Room'],
      maxGuests: 2,
      rating: 4.8,
      reviewCount: 24,
      familyMembers: 4,
      lookingFor: 'US or UK university student',
      exchangeType: 'both'
    },
    {
      id: '2',
      hostName: 'Kenji Tanaka',
      hostAvatar: 'KT',
      hostUniversity: 'University of Tokyo',
      location: 'Tokyo',
      country: 'Japan',
      propertyType: 'House',
      duration: '2-4 weeks',
      availableFrom: '2026-07-15',
      availableTo: '2026-09-15',
      description: 'Traditional Japanese house with modern amenities. Experience authentic Japanese family life in Tokyo. Great location near Shibuya!',
      images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'],
      amenities: ['WiFi', 'Kitchen', 'Garden', 'Parking', 'Pet Friendly'],
      maxGuests: 1,
      rating: 5.0,
      reviewCount: 18,
      familyMembers: 3,
      lookingFor: 'European student interested in Japanese culture',
      exchangeType: 'family'
    },
    {
      id: '3',
      hostName: 'Emma Wilson',
      hostAvatar: 'EW',
      hostUniversity: 'University of Melbourne',
      location: 'Melbourne',
      country: 'Australia',
      propertyType: 'Studio',
      duration: '1-3 weeks',
      availableFrom: '2026-12-01',
      availableTo: '2027-02-28',
      description: 'Modern studio apartment near the beach. Perfect for a solo student exchange. Close to university and city center.',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      amenities: ['WiFi', 'Pool', 'Gym', 'Beach Access', 'Bike Storage'],
      maxGuests: 1,
      rating: 4.9,
      reviewCount: 31,
      familyMembers: 0,
      lookingFor: 'Any student wanting to explore Australia',
      exchangeType: 'home'
    },
    {
      id: '4',
      hostName: 'Sophie Dubois',
      hostAvatar: 'SD',
      hostUniversity: 'Sorbonne University',
      location: 'Paris',
      country: 'France',
      propertyType: 'Apartment',
      duration: '1-4 weeks',
      availableFrom: '2026-05-01',
      availableTo: '2026-08-31',
      description: 'Charming Parisian apartment with Eiffel Tower view. Our family welcomes students to experience French lifestyle and practice French!',
      images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'],
      amenities: ['WiFi', 'Kitchen', 'Balcony', 'City View', 'Metro Access'],
      maxGuests: 2,
      rating: 4.7,
      reviewCount: 42,
      familyMembers: 5,
      lookingFor: 'Students interested in French culture',
      exchangeType: 'both'
    },
    {
      id: '5',
      hostName: 'Lucas Silva',
      hostAvatar: 'LS',
      hostUniversity: 'University of São Paulo',
      location: 'São Paulo',
      country: 'Brazil',
      propertyType: 'House',
      duration: '2-6 weeks',
      availableFrom: '2026-06-15',
      availableTo: '2026-12-15',
      description: 'Spacious house in vibrant São Paulo. Experience Brazilian culture, music, and food with our welcoming family!',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
      amenities: ['WiFi', 'Kitchen', 'Pool', 'BBQ Area', 'Garden'],
      maxGuests: 3,
      rating: 4.9,
      reviewCount: 27,
      familyMembers: 6,
      lookingFor: 'Open to all students',
      exchangeType: 'family'
    },
    {
      id: '6',
      hostName: 'Anna Schmidt',
      hostAvatar: 'AS',
      hostUniversity: 'Ludwig Maximilian University',
      location: 'Munich',
      country: 'Germany',
      propertyType: 'Apartment',
      duration: '1-2 weeks',
      availableFrom: '2026-09-01',
      availableTo: '2026-10-31',
      description: 'Modern apartment near English Garden. Perfect for students during Oktoberfest season! Family-friendly environment.',
      images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
      amenities: ['WiFi', 'Kitchen', 'Heating', 'Bike Available', 'Public Transport'],
      maxGuests: 2,
      rating: 4.6,
      reviewCount: 15,
      familyMembers: 4,
      lookingFor: 'Students interested in German culture',
      exchangeType: 'both'
    }
  ];

  const filteredPlaces = exchangePlaces.filter(place => {
    if (selectedExchangeType === 'all') return true;
    return place.exchangeType === selectedExchangeType;
  });

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleContactHost = (place: ExchangePlace) => {
    setSelectedPlace(place);
    setShowChatModal(true);
  };

  const handleSendMessage = (message: string) => {
    // In a real app, this would send the message to the backend
    console.log('Sending message to', selectedPlace?.hostName, ':', message);
    toast.success(`Message sent to ${selectedPlace?.hostName}! They will receive your message and can respond via the Messages page.`);
    setShowChatModal(false);
    setSelectedPlace(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowLeftRight className="w-12 h-12 text-rose-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Exchange Places
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience new cultures by exchanging homes or staying with host families around the world.
            Connect with verified students for authentic cultural immersion.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filter by Exchange Type</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedExchangeType('all')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedExchangeType === 'all'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Exchanges
            </button>
            <button
              onClick={() => setSelectedExchangeType('home')}
              className={`px-6 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                selectedExchangeType === 'home'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Home className="w-4 h-4" />
              Home Exchange Only
            </button>
            <button
              onClick={() => setSelectedExchangeType('family')}
              className={`px-6 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                selectedExchangeType === 'family'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Host Family Only
            </button>
            <button
              onClick={() => setSelectedExchangeType('both')}
              className={`px-6 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                selectedExchangeType === 'both'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              Both Available
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? 'exchange' : 'exchanges'}
          </p>
        </div>

        {/* Exchange Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div key={place.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={place.images[0]}
                  alt={place.location}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(place.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition shadow-lg"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favoriteIds.has(place.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
                {/* Exchange Type Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900 flex items-center gap-1">
                  {place.exchangeType === 'home' && <Home className="w-3 h-3" />}
                  {place.exchangeType === 'family' && <Users className="w-3 h-3" />}
                  {place.exchangeType === 'both' && <ArrowLeftRight className="w-3 h-3" />}
                  {place.exchangeType === 'home' ? 'Home' : place.exchangeType === 'family' ? 'Family' : 'Both'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Host Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-sm font-semibold text-white">
                    {place.hostAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{place.hostName}</h3>
                    <p className="text-xs text-gray-600 truncate">{place.hostUniversity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">{place.rating}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="font-medium">{place.location}, {place.country}</span>
                </div>

                {/* Property Type */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                  <Home className="w-4 h-4" />
                  <span>{place.propertyType}</span>
                  <span>•</span>
                  <Users className="w-4 h-4" />
                  <span>Up to {place.maxGuests} guests</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {place.description}
                </p>

                {/* Duration & Availability */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-rose-500" />
                    <span>Duration: {place.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span>Available: {new Date(place.availableFrom).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(place.availableTo).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Looking For */}
                <div className="bg-rose-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Looking for:</p>
                  <p className="text-sm font-medium text-gray-900">{place.lookingFor}</p>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleContactHost(place)}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Host
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exchanges found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options</p>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && selectedPlace && (
          <ChatModal
            place={selectedPlace}
            onClose={() => {
              setShowChatModal(false);
              setSelectedPlace(null);
            }}
            onSend={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
}

// Chat Modal Component
function ChatModal({
  place,
  onClose,
  onSend
}: {
  place: ExchangePlace;
  onClose: () => void;
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-lg font-semibold text-rose-600">
                {place.hostAvatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{place.hostName}</h2>
                <p className="text-rose-100 text-sm">{place.location}, {place.country}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Place Info */}
        <div className="p-6 border-b border-gray-200">
          <img
            src={place.images[0]}
            alt={place.location}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Home className="w-4 h-4 text-rose-500" />
              <span className="font-medium">{place.propertyType}</span>
              <span>•</span>
              <Users className="w-4 h-4 text-rose-500" />
              <span>Up to {place.maxGuests} guests</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>Duration: {place.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>{new Date(place.availableFrom).toLocaleDateString()} - {new Date(place.availableTo).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send a message to {place.hostName}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${place.hostName.split(' ')[0]}, I'm interested in your ${place.exchangeType === 'home' ? 'home exchange' : place.exchangeType === 'family' ? 'host family' : 'exchange'} program in ${place.location}...`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500 min-h-[120px]"
            required
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
