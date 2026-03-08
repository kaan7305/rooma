'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useToast } from '@/lib/toast-context';
import {
  MapPin,
  Users,
  DollarSign,
  Home,
  Calendar,
  Filter,
  Heart,
  MessageCircle,
  Star,
  CheckCircle,
  Plus,
  UserPlus,
  Bed,
  Bath,
  Wifi,
  Car
} from 'lucide-react';

interface RoommateListing {
  id: string;
  title: string;
  posterName: string;
  posterAvatar: string;
  posterUniversity: string;
  location: string;
  address: string;
  propertyType: string;
  totalBedrooms: number;
  totalBathrooms: number;
  currentOccupants: number;
  lookingFor: number;
  rentPerPerson: number;
  utilities: 'included' | 'split' | 'not-included';
  availableFrom: string;
  leaseDuration: string;
  images: string[];
  amenities: string[];
  description: string;
  roommatePreferences: {
    age: string;
    gender: 'any' | 'male' | 'female';
    occupation: string[];
    lifestyle: string[];
  };
  verified: boolean;
  postedDate: string;
  rating: number;
}

export default function RoommateFinderPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const { roommateFavorites, addRoommateFavorite, removeRoommateFavorite, isRoommateFavorite, loadFavorites } = useFavoritesStore();
  const [selectedListing, setSelectedListing] = useState<RoommateListing | null>(null);
  const [filterGender, setFilterGender] = useState<'all' | 'any' | 'male' | 'female'>('all');
  const [filterPropertyType, setFilterPropertyType] = useState<'all' | 'apartment' | 'house'>('all');

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Dummy roommate listings data
  const roommateListings: RoommateListing[] = [
    {
      id: '1',
      title: 'Looking for 1 Roommate in Spacious 3BR Apartment',
      posterName: 'Sarah Martinez',
      posterAvatar: 'SM',
      posterUniversity: 'Stanford University',
      location: 'Palo Alto, CA',
      address: '456 University Ave, Palo Alto',
      propertyType: 'Apartment',
      totalBedrooms: 3,
      totalBathrooms: 2,
      currentOccupants: 2,
      lookingFor: 1,
      rentPerPerson: 1200,
      utilities: 'split',
      availableFrom: '2026-02-01',
      leaseDuration: '12 months',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      amenities: ['WiFi', 'Parking', 'Laundry', 'Gym', 'Pool', 'Dishwasher'],
      description: 'We are 2 grad students (both 24F) looking for one more roommate! The apartment is spacious, modern, and close to campus. We\'re clean, respectful, and social. Looking for someone similar!',
      roommatePreferences: {
        age: '22-28',
        gender: 'female',
        occupation: ['Student', 'Young Professional'],
        lifestyle: ['Non-smoker', 'LGBTQ+ Friendly', 'Social', 'Clean']
      },
      verified: true,
      postedDate: '2025-12-18',
      rating: 4.9
    },
    {
      id: '2',
      title: '1 Room Available in 4BR House - Great Location!',
      posterName: 'Michael Chen',
      posterAvatar: 'MC',
      posterUniversity: 'UC Berkeley',
      location: 'Berkeley, CA',
      address: '789 College Ave, Berkeley',
      propertyType: 'House',
      totalBedrooms: 4,
      totalBathrooms: 2.5,
      currentOccupants: 3,
      lookingFor: 1,
      rentPerPerson: 950,
      utilities: 'not-included',
      availableFrom: '2026-01-15',
      leaseDuration: '6-12 months',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
      amenities: ['WiFi', 'Backyard', 'Parking', 'Laundry', 'Kitchen'],
      description: 'We\'re 3 guys (2 engineers, 1 grad student) looking for a 4th roommate. House has a big backyard, perfect for BBQs. Close to campus and BART. Chill environment!',
      roommatePreferences: {
        age: '21-30',
        gender: 'any',
        occupation: ['Student', 'Young Professional', 'Graduate Student'],
        lifestyle: ['420 Friendly', 'Social', 'Respectful', 'Active']
      },
      verified: true,
      postedDate: '2025-12-20',
      rating: 4.7
    },
    {
      id: '3',
      title: 'Female Roommate Needed for 2BR Near Campus',
      posterName: 'Emma Thompson',
      posterAvatar: 'ET',
      posterUniversity: 'Harvard University',
      location: 'Cambridge, MA',
      address: '123 Harvard St, Cambridge',
      propertyType: 'Apartment',
      totalBedrooms: 2,
      totalBathrooms: 1,
      currentOccupants: 1,
      lookingFor: 1,
      rentPerPerson: 1400,
      utilities: 'included',
      availableFrom: '2026-03-01',
      leaseDuration: '12 months',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      amenities: ['WiFi', 'Heating', 'Study Space', 'Laundry'],
      description: 'PhD student (27F) looking for a responsible female roommate. Quiet apartment, perfect for studying. I spend most time at lab. Looking for someone clean and mature.',
      roommatePreferences: {
        age: '24-32',
        gender: 'female',
        occupation: ['Graduate Student', 'Young Professional'],
        lifestyle: ['Non-smoker', 'Quiet', 'Clean', 'Pet-free']
      },
      verified: true,
      postedDate: '2025-12-15',
      rating: 5.0
    },
    {
      id: '4',
      title: 'Room in 3BR Apartment - Young Professionals',
      posterName: 'David Kim',
      posterAvatar: 'DK',
      posterUniversity: 'Columbia University (Alumni)',
      location: 'New York, NY',
      address: '567 Broadway, New York',
      propertyType: 'Apartment',
      totalBedrooms: 3,
      totalBathrooms: 2,
      currentOccupants: 2,
      lookingFor: 1,
      rentPerPerson: 1800,
      utilities: 'split',
      availableFrom: '2026-02-15',
      leaseDuration: '12 months',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
      amenities: ['WiFi', 'Doorman', 'Gym', 'Rooftop', 'Laundry'],
      description: 'Two young professionals (consultants, 26M & 27M) seeking third roommate. Modern building with great amenities. Social but respectful. Work hard, play hard vibe!',
      roommatePreferences: {
        age: '24-30',
        gender: 'any',
        occupation: ['Young Professional'],
        lifestyle: ['Social', 'Clean', 'Working Professional', 'Non-smoker']
      },
      verified: true,
      postedDate: '2025-12-19',
      rating: 4.8
    },
    {
      id: '5',
      title: 'Seeking Roommate for Cozy 2BR Apartment',
      posterName: 'Lisa Park',
      posterAvatar: 'LP',
      posterUniversity: 'MIT',
      location: 'Cambridge, MA',
      address: '890 Mass Ave, Cambridge',
      propertyType: 'Apartment',
      totalBedrooms: 2,
      totalBathrooms: 1,
      currentOccupants: 1,
      lookingFor: 1,
      rentPerPerson: 1300,
      utilities: 'split',
      availableFrom: '2026-01-20',
      leaseDuration: '6-12 months',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      amenities: ['WiFi', 'Kitchen', 'Laundry', 'Balcony'],
      description: 'Software engineer (25F) looking for female roommate. I work from home sometimes. Apartment is near T station. Looking for someone clean and friendly!',
      roommatePreferences: {
        age: '23-29',
        gender: 'female',
        occupation: ['Student', 'Young Professional'],
        lifestyle: ['Non-smoker', 'Clean', 'LGBTQ+ Friendly', 'Social']
      },
      verified: false,
      postedDate: '2025-12-10',
      rating: 4.6
    },
    {
      id: '6',
      title: '1 Space Available in 5BR Student House',
      posterName: 'Alex Johnson',
      posterAvatar: 'AJ',
      posterUniversity: 'UCLA',
      location: 'Los Angeles, CA',
      address: '234 Westwood Blvd, Los Angeles',
      propertyType: 'House',
      totalBedrooms: 5,
      totalBathrooms: 3,
      currentOccupants: 4,
      lookingFor: 1,
      rentPerPerson: 850,
      utilities: 'split',
      availableFrom: '2026-03-15',
      leaseDuration: '12 months',
      images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
      amenities: ['WiFi', 'Parking', 'Backyard', 'Laundry', 'BBQ Area'],
      description: 'House of 4 undergrads looking for our 5th! We\'re all juniors/seniors, mix of majors. House has great vibe - social but also respectful of study time. Weekly house dinners!',
      roommatePreferences: {
        age: '19-23',
        gender: 'any',
        occupation: ['Student'],
        lifestyle: ['Social', 'Clean', '420 Friendly', 'Active']
      },
      verified: true,
      postedDate: '2025-12-12',
      rating: 4.5
    }
  ];

  const filteredListings = roommateListings.filter(listing => {
    if (filterGender !== 'all' && listing.roommatePreferences.gender !== filterGender && listing.roommatePreferences.gender !== 'any') {
      return false;
    }
    if (filterPropertyType !== 'all' && listing.propertyType.toLowerCase() !== filterPropertyType) {
      return false;
    }
    return true;
  });

  const toggleFavorite = (id: string) => {
    if (isRoommateFavorite(id)) {
      removeRoommateFavorite(id);
    } else {
      addRoommateFavorite(id);
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
                <UserPlus className="w-10 h-10 text-rose-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Roommate Finder
                </h1>
              </div>
              <p className="text-gray-600">
                Find the perfect roommate for your existing home
              </p>
            </div>
            <button
              onClick={() => router.push('/roommate-finder/new')}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post Roommate Listing
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-rose-900 font-semibold mb-1">
                Already have a place? Looking for roommates?
              </p>
              <p className="text-sm text-rose-800">
                Post your listing here to find compatible roommates to share rent and living space!
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'any', 'male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setFilterGender(gender as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterGender === gender
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'apartment', 'house'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterPropertyType(type as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterPropertyType === type
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition shadow-lg"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isRoommateFavorite(listing.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
                {/* Occupancy Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {listing.currentOccupants} looking for {listing.lookingFor}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Poster Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-sm font-semibold text-white">
                      {listing.posterAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{listing.posterName}</h3>
                        {listing.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" aria-label="Verified" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{listing.posterUniversity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">{listing.rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {listing.title}
                </h2>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium">{listing.location}</span>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Home className="w-4 h-4 text-rose-500" />
                    <span>{listing.propertyType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Bed className="w-4 h-4 text-rose-500" />
                    <span>{listing.totalBedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Bath className="w-4 h-4 text-rose-500" />
                    <span>{listing.totalBathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span>{listing.leaseDuration}</span>
                  </div>
                </div>

                {/* Rent */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Rent per person:</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-xl font-bold text-green-700">{listing.rentPerPerson}</span>
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Utilities: {listing.utilities === 'included' ? 'Included' : listing.utilities === 'split' ? 'Split among roommates' : 'Not included'}
                  </p>
                </div>

                {/* Preferences */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Looking for:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs font-medium">
                      {listing.roommatePreferences.gender === 'any' ? 'Any gender' : listing.roommatePreferences.gender}
                    </span>
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs font-medium">
                      Age: {listing.roommatePreferences.age}
                    </span>
                    {listing.roommatePreferences.occupation.slice(0, 2).map(occ => (
                      <span key={occ} className="px-2 py-1 bg-pink-50 text-pink-700 rounded text-xs font-medium">
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {listing.description}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      toast.info(`Contact ${listing.posterName} via messages`);
                      router.push('/messages');
                    }}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact
                  </button>
                  <button className="px-4 py-3 border-2 border-rose-500 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition">
                    Details
                  </button>
                </div>

                {/* Posted date */}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Posted {getDaysAgo(listing.postedDate)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
