'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useToast } from '@/lib/toast-context';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Home,
  MessageCircle,
  Send,
  Filter,
  Clock,
  User,
  CheckCircle,
  Plus,
  Briefcase,
  Heart
} from 'lucide-react';

interface GuestRequest {
  id: string;
  guestName: string;
  guestAvatar: string;
  guestUniversity: string;
  location: string;
  country: string;
  checkInDate: string;
  checkOutDate: string;
  budget: string;
  guests: number;
  propertyType: string[];
  amenitiesRequired: string[];
  description: string;
  postedDate: string;
  status: 'active' | 'offers_received' | 'booked';
  offerCount: number;
  verified: boolean;
}

interface HostOffer {
  requestId: string;
  propertyTitle: string;
  price: string;
  message: string;
}

export default function GuestRequestsPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const { guestRequestFavorites, addGuestRequestFavorite, removeGuestRequestFavorite, isGuestRequestFavorite, loadFavorites } = useFavoritesStore();
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'offers_received' | 'booked'>('all');
  const [myOffers, setMyOffers] = useState<HostOffer[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      loadFavorites();
    }
  }, [isAuthenticated, router, loadFavorites]);

  // Dummy guest requests data
  const guestRequests: GuestRequest[] = [
    {
      id: '1',
      guestName: 'Emma Thompson',
      guestAvatar: 'ET',
      guestUniversity: 'Harvard University',
      location: 'Barcelona',
      country: 'Spain',
      checkInDate: '2026-09-01',
      checkOutDate: '2026-12-15',
      budget: '$800-1200/month',
      guests: 1,
      propertyType: ['Studio', 'Apartment'],
      amenitiesRequired: ['WiFi', 'Kitchen', 'Study Space', 'Near University'],
      description: 'Looking for a quiet place near the university for my semester abroad. I\'m a clean, respectful student studying architecture. Would love a place with good natural light for my projects!',
      postedDate: '2025-12-15',
      status: 'active',
      offerCount: 3,
      verified: true
    },
    {
      id: '2',
      guestName: 'Michael Chen',
      guestAvatar: 'MC',
      guestUniversity: 'MIT',
      location: 'London',
      country: 'UK',
      checkInDate: '2026-06-01',
      checkOutDate: '2026-08-31',
      budget: '$1000-1500/month',
      guests: 2,
      propertyType: ['Apartment', 'House'],
      amenitiesRequired: ['WiFi', 'Kitchen', 'Laundry', 'Gym'],
      description: 'My partner and I are looking for a comfortable place during our summer internship. We\'re both working professionals, quiet, and responsible. Prefer a place with good transport links.',
      postedDate: '2025-12-18',
      status: 'offers_received',
      offerCount: 7,
      verified: true
    },
    {
      id: '3',
      guestName: 'Sofia Rodriguez',
      guestAvatar: 'SR',
      guestUniversity: 'Stanford University',
      location: 'Tokyo',
      country: 'Japan',
      checkInDate: '2026-04-01',
      checkOutDate: '2026-07-31',
      budget: '$900-1300/month',
      guests: 1,
      propertyType: ['Studio', 'Shared Apartment'],
      amenitiesRequired: ['WiFi', 'AC', 'Near Train Station', 'Quiet Area'],
      description: 'Studying Japanese culture and language. Looking for accommodation in a quiet neighborhood. Open to staying with a host family to immerse in the culture!',
      postedDate: '2025-12-10',
      status: 'active',
      offerCount: 5,
      verified: true
    },
    {
      id: '4',
      guestName: 'James Wilson',
      guestAvatar: 'JW',
      guestUniversity: 'Oxford University',
      location: 'Berlin',
      country: 'Germany',
      checkInDate: '2026-10-01',
      checkOutDate: '2027-03-31',
      budget: '$700-1000/month',
      guests: 1,
      propertyType: ['Studio', 'Room'],
      amenitiesRequired: ['WiFi', 'Heating', 'Kitchen', 'Bike Storage'],
      description: 'PhD student looking for long-term accommodation. I spend most of my time at the library/lab, need a quiet place to sleep and occasional study. Non-smoker, no pets.',
      postedDate: '2025-12-12',
      status: 'active',
      offerCount: 2,
      verified: true
    },
    {
      id: '5',
      guestName: 'Aisha Patel',
      guestAvatar: 'AP',
      guestUniversity: 'Yale University',
      location: 'Paris',
      country: 'France',
      checkInDate: '2026-01-15',
      checkOutDate: '2026-05-15',
      budget: '$1200-1600/month',
      guests: 1,
      propertyType: ['Apartment', 'Studio'],
      amenitiesRequired: ['WiFi', 'Kitchen', 'Metro Access', 'Balcony'],
      description: 'Art history student seeking charming accommodation in Paris. Would love a place with character, preferably with a balcony or good views. Respectful of neighbors and quiet hours.',
      postedDate: '2025-12-20',
      status: 'offers_received',
      offerCount: 12,
      verified: true
    },
    {
      id: '6',
      guestName: 'David Kim',
      guestAvatar: 'DK',
      guestUniversity: 'Princeton University',
      location: 'Amsterdam',
      country: 'Netherlands',
      checkInDate: '2026-02-01',
      checkOutDate: '2026-06-30',
      budget: '$850-1150/month',
      guests: 1,
      propertyType: ['Studio', 'Room'],
      amenitiesRequired: ['WiFi', 'Bike Included', 'Kitchen', 'Central Location'],
      description: 'Engineering student on exchange program. Active cyclist, would appreciate bike storage or included bike. Clean, organized, and friendly. Looking for a welcoming community.',
      postedDate: '2025-12-08',
      status: 'active',
      offerCount: 4,
      verified: false
    }
  ];

  const filteredRequests = guestRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const handleSubmitOffer = (request: GuestRequest, propertyTitle: string, price: string, message: string) => {
    const newOffer: HostOffer = {
      requestId: request.id,
      propertyTitle,
      price,
      message
    };
    setMyOffers([...myOffers, newOffer]);
    toast.success(`Offer submitted to ${request.guestName}! They will receive your offer and can contact you if interested.`);
    setShowOfferModal(false);
    setSelectedRequest(null);
  };

  const hasSubmittedOffer = (requestId: string) => {
    return myOffers.some(offer => offer.requestId === requestId);
  };

  const toggleFavorite = (requestId: string) => {
    if (isGuestRequestFavorite(requestId)) {
      removeGuestRequestFavorite(requestId);
    } else {
      addGuestRequestFavorite(requestId);
    }
  };

  const getDaysAgo = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const getStayDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    if (months === 0) return `${days} days`;
    if (days === 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
    return `${months} ${months === 1 ? 'month' : 'months'} ${days} days`;
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
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-10 h-10 text-rose-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Guest Requests
                </h1>
              </div>
              <p className="text-gray-600">
                Browse guest demands and submit your offers to match their needs
              </p>
            </div>
            <button
              onClick={() => router.push('/guest-requests/new')}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post Your Request
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-semibold mb-1">
                How it works:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Guests post their accommodation needs with location, dates, and budget</li>
                <li>• Hosts browse requests and submit personalized offers</li>
                <li>• Guests receive offers directly and can contact hosts they're interested in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filter by Status</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Requests ({guestRequests.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filterStatus === 'active'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({guestRequests.filter(r => r.status === 'active').length})
            </button>
            <button
              onClick={() => setFilterStatus('offers_received')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filterStatus === 'offers_received'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Offers Received ({guestRequests.filter(r => r.status === 'offers_received').length})
            </button>
          </div>
        </div>

        {/* Guest Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition relative">
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(request.id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-50 transition shadow-md z-10"
                title={isGuestRequestFavorite(request.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isGuestRequestFavorite(request.id)
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>

              {/* Guest Info */}
              <div className="flex items-start justify-between mb-4 pr-12">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-lg font-semibold text-white">
                    {request.guestAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{request.guestName}</h3>
                      {request.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" aria-label="Verified Student" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{request.guestUniversity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'active' ? 'bg-green-100 text-green-700' :
                    request.status === 'offers_received' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {request.status === 'active' ? 'Active' :
                     request.status === 'offers_received' ? `${request.offerCount} Offers` :
                     'Booked'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{getDaysAgo(request.postedDate)}</p>
                </div>
              </div>

              {/* Location & Dates */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <span className="font-semibold text-lg">{request.location}, {request.country}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span className="text-sm">
                    {new Date(request.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(request.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-gray-500">({getStayDuration(request.checkInDate, request.checkOutDate)})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{request.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4 text-rose-500" />
                  <span className="text-sm">{request.guests} {request.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-2">Looking for:</p>
                <div className="flex flex-wrap gap-2">
                  {request.propertyType.map((type) => (
                    <span key={type} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-medium">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">Required amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {request.amenitiesRequired.map((amenity) => (
                    <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {request.description}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                {hasSubmittedOffer(request.id) ? (
                  <button
                    disabled
                    className="flex-1 bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Offer Submitted
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowOfferModal(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Offer
                  </button>
                )}
                <button
                  onClick={() => {
                    toast.info(`Contact ${request.guestName} via messages to discuss their request further.`);
                    router.push('/messages');
                  }}
                  className="px-4 py-3 border-2 border-rose-500 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        )}

        {/* Offer Modal */}
        {showOfferModal && selectedRequest && (
          <OfferModal
            request={selectedRequest}
            onClose={() => {
              setShowOfferModal(false);
              setSelectedRequest(null);
            }}
            onSubmit={handleSubmitOffer}
          />
        )}
      </div>
    </div>
  );
}

// Offer Modal Component
function OfferModal({
  request,
  onClose,
  onSubmit
}: {
  request: GuestRequest;
  onClose: () => void;
  onSubmit: (request: GuestRequest, propertyTitle: string, price: string, message: string) => void;
}) {
  const [propertyTitle, setPropertyTitle] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (propertyTitle.trim() && price.trim() && message.trim()) {
      onSubmit(request, propertyTitle, price, message);
      setPropertyTitle('');
      setPrice('');
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Submit Your Offer</h2>
              <p className="text-rose-100 text-sm">to {request.guestName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Request Summary */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Request Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="font-medium">{request.location}, {request.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>{new Date(request.checkInDate).toLocaleDateString()} - {new Date(request.checkOutDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-700">{request.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              <span>{request.guests} {request.guests === 1 ? 'guest' : 'guests'}</span>
            </div>
          </div>
        </div>

        {/* Offer Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder="e.g., Cozy Studio Near University"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Price (per month) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., $950"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Guest's budget: {request.budget}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Guest *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${request.guestName.split(' ')[0]},\n\nI have a property that matches your requirements in ${request.location}. It includes...\n\nI'd be happy to discuss the details further!`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500 min-h-[150px]"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
              Submit Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
