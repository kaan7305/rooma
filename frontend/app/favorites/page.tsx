'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Star, Briefcase, Home as HomeIcon, Users, Calendar, DollarSign, CheckCircle, UserPlus, Bed, Bath } from 'lucide-react';
import { useFavoritesStore } from '@/lib/favorites-store';
import { allProperties, type Property } from '@/data/properties';

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

interface RoommateListing {
  id: string;
  title: string;
  posterName: string;
  posterAvatar: string;
  posterUniversity: string;
  location: string;
  propertyType: string;
  totalBedrooms: number;
  totalBathrooms: number;
  currentOccupants: number;
  lookingFor: number;
  rentPerPerson: number;
  utilities: 'included' | 'split' | 'not-included';
  images: string[];
  description: string;
  roommatePreferences: {
    age: string;
    gender: 'any' | 'male' | 'female';
  };
  verified: boolean;
  rating: number;
}

// Dummy guest requests data (same as in guest-requests page)
const allGuestRequests: GuestRequest[] = [
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
    description: 'Looking for a quiet place near the university for my semester abroad.',
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
    description: 'My partner and I are looking for a comfortable place during our summer internship.',
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
    description: 'Studying Japanese culture and language.',
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
    description: 'PhD student looking for long-term accommodation.',
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
    description: 'Art history student seeking charming accommodation in Paris.',
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
    description: 'Engineering student on exchange program.',
    postedDate: '2025-12-08',
    status: 'active',
    offerCount: 4,
    verified: false
  }
];

// Dummy roommate listings data (same as in roommate-finder page)
const allRoommateListings: RoommateListing[] = [
  {
    id: '1',
    title: 'Looking for 1 Roommate in Spacious 3BR Apartment',
    posterName: 'Sarah Martinez',
    posterAvatar: 'SM',
    posterUniversity: 'Stanford University',
    location: 'Palo Alto, CA',
    propertyType: 'Apartment',
    totalBedrooms: 3,
    totalBathrooms: 2,
    currentOccupants: 2,
    lookingFor: 1,
    rentPerPerson: 1200,
    utilities: 'split',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    description: 'We are 2 grad students (both 24F) looking for one more roommate! The apartment is spacious, modern, and close to campus.',
    roommatePreferences: {
      age: '22-28',
      gender: 'female',
    },
    verified: true,
    rating: 4.9
  },
  {
    id: '2',
    title: '1 Room Available in 4BR House - Great Location!',
    posterName: 'Michael Chen',
    posterAvatar: 'MC',
    posterUniversity: 'UC Berkeley',
    location: 'Berkeley, CA',
    propertyType: 'House',
    totalBedrooms: 4,
    totalBathrooms: 2.5,
    currentOccupants: 3,
    lookingFor: 1,
    rentPerPerson: 950,
    utilities: 'not-included',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    description: 'We\'re 3 guys (2 engineers, 1 grad student) looking for a 4th roommate. House has a big backyard, perfect for BBQs.',
    roommatePreferences: {
      age: '21-30',
      gender: 'any',
    },
    verified: true,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Female Roommate Needed for 2BR Near Campus',
    posterName: 'Emma Thompson',
    posterAvatar: 'ET',
    posterUniversity: 'Harvard University',
    location: 'Cambridge, MA',
    propertyType: 'Apartment',
    totalBedrooms: 2,
    totalBathrooms: 1,
    currentOccupants: 1,
    lookingFor: 1,
    rentPerPerson: 1400,
    utilities: 'included',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    description: 'PhD student (27F) looking for a responsible female roommate. Quiet apartment, perfect for studying.',
    roommatePreferences: {
      age: '24-32',
      gender: 'female',
    },
    verified: true,
    rating: 5.0
  },
  {
    id: '4',
    title: 'Room in 3BR Apartment - Young Professionals',
    posterName: 'David Kim',
    posterAvatar: 'DK',
    posterUniversity: 'Columbia University (Alumni)',
    location: 'New York, NY',
    propertyType: 'Apartment',
    totalBedrooms: 3,
    totalBathrooms: 2,
    currentOccupants: 2,
    lookingFor: 1,
    rentPerPerson: 1800,
    utilities: 'split',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    description: 'Two young professionals (consultants, 26M & 27M) seeking third roommate. Modern building with great amenities.',
    roommatePreferences: {
      age: '24-30',
      gender: 'any',
    },
    verified: true,
    rating: 4.8
  },
  {
    id: '5',
    title: 'Seeking Roommate for Cozy 2BR Apartment',
    posterName: 'Lisa Park',
    posterAvatar: 'LP',
    posterUniversity: 'MIT',
    location: 'Cambridge, MA',
    propertyType: 'Apartment',
    totalBedrooms: 2,
    totalBathrooms: 1,
    currentOccupants: 1,
    lookingFor: 1,
    rentPerPerson: 1300,
    utilities: 'split',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    description: 'Software engineer (25F) looking for female roommate. I work from home sometimes. Apartment is near T station.',
    roommatePreferences: {
      age: '23-29',
      gender: 'female',
    },
    verified: false,
    rating: 4.6
  },
  {
    id: '6',
    title: '1 Space Available in 5BR Student House',
    posterName: 'Alex Johnson',
    posterAvatar: 'AJ',
    posterUniversity: 'UCLA',
    location: 'Los Angeles, CA',
    propertyType: 'House',
    totalBedrooms: 5,
    totalBathrooms: 3,
    currentOccupants: 4,
    lookingFor: 1,
    rentPerPerson: 850,
    utilities: 'split',
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    description: 'House of 4 undergrads looking for our 5th! We\'re all juniors/seniors, mix of majors. House has great vibe.',
    roommatePreferences: {
      age: '19-23',
      gender: 'any',
    },
    verified: true,
    rating: 4.5
  }
];

export default function FavoritesPage() {
  const { favorites, guestRequestFavorites, roommateFavorites, loadFavorites, removeFavorite, removeGuestRequestFavorite, removeRoommateFavorite, isFavorite, isGuestRequestFavorite } = useFavoritesStore();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [favoriteGuestRequests, setFavoriteGuestRequests] = useState<GuestRequest[]>([]);
  const [favoriteRoommateListings, setFavoriteRoommateListings] = useState<RoommateListing[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'requests' | 'roommates'>('properties');

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const favProps = allProperties.filter(prop => favorites.includes(prop.id));
    setFavoriteProperties(favProps);
  }, [favorites]);

  useEffect(() => {
    const favRequests = allGuestRequests.filter(req => guestRequestFavorites.includes(req.id));
    setFavoriteGuestRequests(favRequests);
  }, [guestRequestFavorites]);

  useEffect(() => {
    const favRoommates = allRoommateListings.filter(listing => roommateFavorites.includes(listing.id));
    setFavoriteRoommateListings(favRoommates);
  }, [roommateFavorites]);

  const toggleFavorite = (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(propertyId);
  };

  const totalFavorites = favoriteProperties.length + favoriteGuestRequests.length + favoriteRoommateListings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            {totalFavorites} {totalFavorites === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'properties'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            Properties ({favoriteProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Guest Requests ({favoriteGuestRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('roommates')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'roommates'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Roommate Listings ({favoriteRoommateListings.length})
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <>
            {favoriteProperties.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No property favorites yet</h3>
                <p className="text-gray-600 mb-6">Start exploring and save your favorite properties!</p>
                <Link
                  href="/"
                  className="inline-block bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteProperties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <span className="text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {property.duration}
                    </span>
                  </div>
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, property.id)}
                    className="absolute top-3 left-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite(property.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-rose-500'
                      }`}
                    />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{property.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {property.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.type} · {property.beds} bed{property.beds > 1 ? 's' : ''} · {property.baths} bath{property.baths > 1 ? 's' : ''}
                  </p>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      ${property.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">/ month</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-medium">{property.available}</p>
                </div>
              </Link>
            ))}
          </div>
            )}
          </>
        )}

        {/* Guest Requests Tab */}
        {activeTab === 'requests' && (
          <>
            {favoriteGuestRequests.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No guest request favorites yet</h3>
                <p className="text-gray-600 mb-6">Browse guest requests and save the ones you're interested in!</p>
                <Link
                  href="/guest-requests"
                  className="inline-block bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Browse Guest Requests
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoriteGuestRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition relative">
                    {/* Favorite Button */}
                    <button
                      onClick={() => removeGuestRequestFavorite(request.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-50 transition shadow-md z-10"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
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

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {request.description}
                    </p>

                    {/* View Button */}
                    <Link
                      href="/guest-requests"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      View Request
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Roommate Listings Tab */}
        {activeTab === 'roommates' && (
          <>
            {favoriteRoommateListings.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No roommate listing favorites yet</h3>
                <p className="text-gray-600 mb-6">Browse roommate listings and save the ones you're interested in!</p>
                <Link
                  href="/roommate-finder"
                  className="inline-block bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Browse Roommate Listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoriteRoommateListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Favorite Button */}
                      <button
                        onClick={() => removeRoommateFavorite(listing.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition shadow-lg"
                        title="Remove from favorites"
                      >
                        <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
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
                          <HomeIcon className="w-4 h-4 text-rose-500" />
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
                          Utilities: {listing.utilities === 'included' ? 'Included' : listing.utilities === 'split' ? 'Split' : 'Not included'}
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
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {listing.description}
                      </p>

                      {/* View Button */}
                      <Link
                        href="/roommate-finder"
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        View Listing
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
