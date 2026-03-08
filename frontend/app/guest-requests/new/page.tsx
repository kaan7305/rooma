'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Home,
  Briefcase,
  CheckCircle,
  X
} from 'lucide-react';

export default function NewGuestRequestPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [guests, setGuests] = useState(1);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const availablePropertyTypes = ['Studio', 'Apartment', 'House', 'Room', 'Shared Apartment'];
  const availableAmenities = [
    'WiFi',
    'Kitchen',
    'Laundry',
    'AC',
    'Heating',
    'Parking',
    'Gym',
    'Pool',
    'Study Space',
    'Near University',
    'Metro Access',
    'Bike Storage',
    'Balcony',
    'Garden',
    'Pet Friendly',
    'Quiet Area'
  ];

  const togglePropertyType = (type: string) => {
    setPropertyTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!location || !country || !checkInDate || !checkOutDate || !budgetMin || !budgetMax) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (propertyTypes.length === 0) {
      toast.warning('Please select at least one property type');
      return;
    }

    if (amenities.length === 0) {
      toast.warning('Please select at least one required amenity');
      return;
    }

    if (!description.trim()) {
      toast.warning('Please provide a description');
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      toast.warning('Check-out date must be after check-in date');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would send to the backend
      const request = {
        location,
        country,
        checkInDate,
        checkOutDate,
        budget: `$${budgetMin}-${budgetMax}/month`,
        guests,
        propertyType: propertyTypes,
        amenitiesRequired: amenities,
        description,
        postedDate: new Date().toISOString(),
        status: 'active'
      };

      console.log('Guest request submitted:', request);

      toast.success('Request posted successfully! Hosts can now browse your request and submit offers. You will receive notifications when offers come in.');

      router.push('/guest-requests');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to post request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-12 h-12 text-rose-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Post Your Request
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tell hosts what you're looking for and let them come to you with personalized offers
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1 text-rose-500" />
                  City/Location *
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Barcelona, Tokyo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., Spain, Japan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1 text-rose-500" />
                  Check-in Date *
                </label>
                <input
                  type="date"
                  id="checkIn"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  id="checkOut"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1 text-green-600" />
                Budget Range (per month) *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="Min (e.g., 800)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="Max (e.g., 1200)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum</p>
                </div>
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1 text-rose-500" />
                Number of Guests *
              </label>
              <select
                id="guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                required
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>

            {/* Property Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Home className="w-4 h-4 inline mr-1 text-rose-500" />
                Property Types (select all that work for you) *
              </label>
              <div className="flex flex-wrap gap-3">
                {availablePropertyTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => togglePropertyType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      propertyTypes.includes(type)
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {propertyTypes.includes(type) && <CheckCircle className="w-4 h-4 inline mr-1" />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Required Amenities (select your must-haves) *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      amenities.includes(amenity)
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenities.includes(amenity) && '✓ '}
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell hosts about yourself and what you're looking for. Include details about your study program, lifestyle, preferences, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500 min-h-[150px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about your needs to receive better offers from hosts
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">What happens next:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your request will be visible to all verified hosts</li>
                    <li>Hosts can submit personalized offers with pricing and details</li>
                    <li>You'll receive notifications when offers come in</li>
                    <li>Review offers and contact hosts you're interested in</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/guest-requests')}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting Request...' : 'Post Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
