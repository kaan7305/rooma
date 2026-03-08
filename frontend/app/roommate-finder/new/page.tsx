'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import {
  MapPin,
  Users,
  DollarSign,
  Home,
  Calendar,
  CheckCircle,
  UserPlus,
  Bed,
  Bath
} from 'lucide-react';

export default function NewRoommateListingPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [totalBedrooms, setTotalBedrooms] = useState(2);
  const [totalBathrooms, setTotalBathrooms] = useState(1);
  const [currentOccupants, setCurrentOccupants] = useState(1);
  const [lookingFor, setLookingFor] = useState(1);
  const [rentPerPerson, setRentPerPerson] = useState('');
  const [utilities, setUtilities] = useState<'included' | 'split' | 'not-included'>('split');
  const [availableFrom, setAvailableFrom] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('12 months');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  // Roommate preferences
  const [preferredAge, setPreferredAge] = useState('');
  const [preferredGender, setPreferredGender] = useState<'any' | 'male' | 'female'>('any');
  const [preferredOccupation, setPreferredOccupation] = useState<string[]>([]);
  const [preferredLifestyle, setPreferredLifestyle] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const availableAmenities = [
    'WiFi',
    'Parking',
    'Laundry',
    'Gym',
    'Pool',
    'Dishwasher',
    'Backyard',
    'Balcony',
    'Study Space',
    'Kitchen',
    'Heating',
    'AC',
    'Doorman',
    'Rooftop',
    'BBQ Area'
  ];

  const occupationOptions = ['Student', 'Graduate Student', 'Young Professional', 'Working Professional'];
  const lifestyleOptions = [
    'Non-smoker',
    '420 Friendly',
    'Social',
    'Quiet',
    'Clean',
    'Pet-free',
    'Pet Friendly',
    'LGBTQ+ Friendly',
    'Active',
    'Respectful'
  ];

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleOccupation = (occ: string) => {
    setPreferredOccupation(prev =>
      prev.includes(occ)
        ? prev.filter(o => o !== occ)
        : [...prev, occ]
    );
  };

  const toggleLifestyle = (lifestyle: string) => {
    setPreferredLifestyle(prev =>
      prev.includes(lifestyle)
        ? prev.filter(l => l !== lifestyle)
        : [...prev, lifestyle]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title || !location || !address || !rentPerPerson || !availableFrom || !description) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (amenities.length === 0) {
      toast.warning('Please select at least one amenity');
      return;
    }

    if (preferredOccupation.length === 0) {
      toast.warning('Please select at least one preferred occupation');
      return;
    }

    if (preferredLifestyle.length === 0) {
      toast.warning('Please select at least one lifestyle preference');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would send to the backend
      const listing = {
        title,
        location,
        address,
        propertyType,
        totalBedrooms,
        totalBathrooms,
        currentOccupants,
        lookingFor,
        rentPerPerson: Number(rentPerPerson),
        utilities,
        availableFrom,
        leaseDuration,
        description,
        amenities,
        roommatePreferences: {
          age: preferredAge,
          gender: preferredGender,
          occupation: preferredOccupation,
          lifestyle: preferredLifestyle
        },
        postedDate: new Date().toISOString()
      };

      console.log('Roommate listing created:', listing);

      toast.success('Listing posted successfully! Your roommate listing is now live. Potential roommates can contact you through the platform.');

      router.push('/roommate-finder');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to post listing. Please try again.');
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
            <UserPlus className="w-12 h-12 text-rose-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Post Roommate Listing
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Already have a place? Find the perfect roommate to share your home
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Listing Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Looking for 1 Roommate in Spacious 3BR Apartment"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1 text-rose-500" />
                  Location (City, State) *
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Palo Alto, CA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 456 University Ave"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 inline mr-1 text-rose-500" />
                  Property Type *
                </label>
                <select
                  id="propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
              </div>

              <div>
                <label htmlFor="leaseDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Duration *
                </label>
                <select
                  id="leaseDuration"
                  value={leaseDuration}
                  onChange={(e) => setLeaseDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                >
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="12 months">12 months</option>
                  <option value="12+ months">12+ months</option>
                </select>
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="w-4 h-4 inline mr-1 text-rose-500" />
                  Bedrooms *
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  value={totalBedrooms}
                  onChange={(e) => setTotalBedrooms(Number(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  <Bath className="w-4 h-4 inline mr-1 text-rose-500" />
                  Bathrooms *
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={totalBathrooms}
                  onChange={(e) => setTotalBathrooms(Number(e.target.value))}
                  min="1"
                  max="10"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="currentOccupants" className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1 text-rose-500" />
                  Current *
                </label>
                <input
                  type="number"
                  id="currentOccupants"
                  value={currentOccupants}
                  onChange={(e) => setCurrentOccupants(Number(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-2">
                  Looking for *
                </label>
                <input
                  type="number"
                  id="lookingFor"
                  value={lookingFor}
                  onChange={(e) => setLookingFor(Number(e.target.value))}
                  min="1"
                  max="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Rent & Utilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rent" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1 text-green-600" />
                  Rent per Person (monthly) *
                </label>
                <input
                  type="number"
                  id="rent"
                  value={rentPerPerson}
                  onChange={(e) => setRentPerPerson(e.target.value)}
                  placeholder="e.g., 1200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="utilities" className="block text-sm font-medium text-gray-700 mb-2">
                  Utilities *
                </label>
                <select
                  id="utilities"
                  value={utilities}
                  onChange={(e) => setUtilities(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                >
                  <option value="included">Included in rent</option>
                  <option value="split">Split among roommates</option>
                  <option value="not-included">Not included</option>
                </select>
              </div>
            </div>

            {/* Available From */}
            <div>
              <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1 text-rose-500" />
                Available From *
              </label>
              <input
                type="date"
                id="availableFrom"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                required
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities (select all that apply) *
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

            {/* Roommate Preferences Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Roommate Preferences</h3>

              {/* Gender & Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Gender *
                  </label>
                  <div className="flex gap-3">
                    {['any', 'male', 'female'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setPreferredGender(gender as any)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                          preferredGender === gender
                            ? 'bg-rose-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Age Range
                  </label>
                  <input
                    type="text"
                    id="age"
                    value={preferredAge}
                    onChange={(e) => setPreferredAge(e.target.value)}
                    placeholder="e.g., 22-28"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Occupation *
                </label>
                <div className="flex flex-wrap gap-2">
                  {occupationOptions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => toggleOccupation(occ)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        preferredOccupation.includes(occ)
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {preferredOccupation.includes(occ) && '✓ '}
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lifestyle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Lifestyle Preferences *
                </label>
                <div className="flex flex-wrap gap-2">
                  {lifestyleOptions.map((lifestyle) => (
                    <button
                      key={lifestyle}
                      type="button"
                      onClick={() => toggleLifestyle(lifestyle)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        preferredLifestyle.includes(lifestyle)
                          ? 'bg-pink-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {preferredLifestyle.includes(lifestyle) && '✓ '}
                      {lifestyle}
                    </button>
                  ))}
                </div>
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
                placeholder="Describe your living situation, the home, and what you're looking for in a roommate..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500 min-h-[150px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be detailed about your living situation and expectations
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-rose-800">
                  <p className="font-semibold mb-1">What happens next:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your listing will be visible to students looking for roommates</li>
                    <li>Interested people can contact you directly through the platform</li>
                    <li>You can review their profiles before responding</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/roommate-finder')}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-4 px-6 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting Listing...' : 'Post Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
