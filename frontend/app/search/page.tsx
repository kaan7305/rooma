'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { MapPin, Star, SlidersHorizontal, X, Heart, Map, List, GitCompare } from 'lucide-react';
import { allProperties, type Property } from '@/data/properties';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useListingsStore, type Listing } from '@/lib/listings-store';
import { useToast } from '@/lib/toast-context';
import PropertyMap from '@/components/PropertyMap';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import SavedSearches from '@/components/SavedSearches';
import { type SavedSearch } from '@/lib/saved-searches-store';
import PropertyComparison from '@/components/PropertyComparison';
import { useComparisonStore } from '@/lib/comparison-store';
import SearchQuickFilters from '@/components/SearchQuickFilters';

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';
  const duration = searchParams.get('duration') || '';

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 5000]);
  const [beds, setBeds] = useState<number | null>(null);
  const [baths, setBaths] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<string>('');
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [instantBook, setInstantBook] = useState(false);
  const [verifiedHost, setVerifiedHost] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [studentVerified, setStudentVerified] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);

  const { isFavorite, addFavorite, removeFavorite, loadFavorites } = useFavoritesStore();
  const { listings, loadListings } = useListingsStore();
  const { addToComparison, isInComparison } = useComparisonStore();
  const toast = useToast();

  useEffect(() => {
    loadFavorites();
    loadListings();
  }, [loadFavorites, loadListings]);

  const allAmenities = ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Parking', 'Gym', 'Pool', 'Pets OK', 'Backyard'];

  useEffect(() => {
    setLoading(true);
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location, duration]);

  useEffect(() => {
    // Helper to convert duration string to months
    const parseDurationToMonths = (duration: string): number => {
      const match = duration.match(/(\d+)\s*(month|year|week)/i);
      if (!match) return 1; // Default to 1 month if can't parse
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      if (unit.startsWith('year')) return value * 12;
      if (unit.startsWith('week')) return value * 0.25;
      return value; // months
    };

    // Combine dummy properties with user listings
    const userListingsAsProperties: Property[] = listings.map((listing: Listing) => ({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      city: listing.city,
      price: listing.price,
      duration: listing.duration,
      durationMonths: parseDurationToMonths(listing.duration),
      type: listing.type,
      beds: listing.beds,
      baths: listing.baths,
      sqft: listing.sqft,
      image: listing.image,
      images: listing.images,
      amenities: listing.amenities,
      rating: listing.rating || 0,
      reviews: 0,
      available: listing.available,
      description: listing.description,
    }));

    let filtered = [...allProperties, ...userListingsAsProperties];

    // Filter by location
    if (location) {
      filtered = filtered.filter(p =>
        p.city.toLowerCase().includes(location.toLowerCase()) ||
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by duration
    if (duration && duration !== 'Any length') {
      filtered = filtered.filter(p => p.duration.toLowerCase() === duration.toLowerCase());
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by beds
    if (beds !== null) {
      filtered = filtered.filter(p => p.beds >= beds);
    }

    // Filter by baths
    if (baths !== null) {
      filtered = filtered.filter(p => p.baths >= baths);
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(p =>
        selectedAmenities.every(amenity => p.amenities.includes(amenity))
      );
    }

    // Filter by property type
    if (propertyType) {
      filtered = filtered.filter(p => p.type.toLowerCase() === propertyType.toLowerCase());
    }

    // Filter by instant book (simulated: properties with rating >= 4.5)
    if (instantBook) {
      filtered = filtered.filter(p => p.rating >= 4.5);
    }

    // Filter by verified host (simulated: properties with rating >= 4.8)
    if (verifiedHost) {
      filtered = filtered.filter(p => p.rating >= 4.8);
    }

    // Filter by pet friendly
    if (petFriendly) {
      filtered = filtered.filter(p => p.amenities.includes('Pets OK'));
    }

    // Filter by student verified (simulated: properties with id % 3 === 0)
    if (studentVerified) {
      filtered = filtered.filter(p => p.id % 3 === 0);
    }

    // Filter by top-rated (quick filter)
    if (activeQuickFilters.includes('top-rated')) {
      filtered = filtered.filter(p => p.rating >= 4.5);
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Recommended - mix of rating and recency
        filtered.sort((a, b) => (b.rating * 0.7 + b.id * 0.3) - (a.rating * 0.7 + a.id * 0.3));
    }

    setProperties(filtered);
  }, [location, duration, priceRange, beds, baths, selectedAmenities, propertyType, sortBy, instantBook, verifiedHost, petFriendly, studentVerified, listings]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleFavorite = (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(propertyId)) {
      removeFavorite(propertyId);
      toast.success('Removed from favorites');
    } else {
      addFavorite(propertyId);
      toast.success('Added to favorites');
    }
  };

  const handleAddToComparison = (e: React.MouseEvent, property: Property) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addToComparison(property);
    if (success) {
      toast.success(`Added ${property.title} to comparison`);
    } else {
      if (isInComparison(property.id)) {
        toast.warning('Property already in comparison');
      } else {
        toast.warning('Maximum 4 properties can be compared');
      }
    }
  };

  const handleApplySavedSearch = (search: SavedSearch) => {
    const params = search.searchParams;
    if (params.priceRange) setPriceRange(params.priceRange);
    if (params.beds !== undefined) setBeds(params.beds);
    if (params.baths !== undefined) setBaths(params.baths);
    if (params.amenities) setSelectedAmenities(params.amenities);
    if (params.propertyType) setPropertyType(params.propertyType);
    if (params.moveInDate) setMoveInDate(params.moveInDate);
    if (params.moveOutDate) setMoveOutDate(params.moveOutDate);
  };

  const handleQuickFilterToggle = (filterId: string) => {
    setActiveQuickFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId];

      // Apply corresponding filters
      switch (filterId) {
        case 'instant-book':
          setInstantBook(!prev.includes(filterId));
          break;
        case 'under-2000':
          if (!prev.includes(filterId)) {
            setPriceRange([500, 2000]);
          } else {
            setPriceRange([500, 5000]);
          }
          break;
        case 'top-rated':
          // Filter properties with rating >= 4.5 (handled in filtering logic)
          break;
        case 'entire-place':
          setPropertyType(!prev.includes(filterId) ? 'Apartment' : '');
          break;
        case 'student-friendly':
          setStudentVerified(!prev.includes(filterId));
          break;
        case 'verified-host':
          setVerifiedHost(!prev.includes(filterId));
          break;
      }

      return newFilters;
    });
  };

  const clearFilters = () => {
    setPriceRange([500, 5000]);
    setBeds(null);
    setBaths(null);
    setSelectedAmenities([]);
    setPropertyType('');
    setMoveInDate('');
    setMoveOutDate('');
    setSortBy('recommended');
    setInstantBook(false);
    setVerifiedHost(false);
    setPetFriendly(false);
    setStudentVerified(false);
  };

  const activeFiltersCount = (beds !== null ? 1 : 0) + (baths !== null ? 1 : 0) + selectedAmenities.length +
    (priceRange[0] !== 500 || priceRange[1] !== 5000 ? 1 : 0) + (propertyType ? 1 : 0) + (moveInDate ? 1 : 0) + (moveOutDate ? 1 : 0) +
    (instantBook ? 1 : 0) + (verifiedHost ? 1 : 0) + (petFriendly ? 1 : 0) + (studentVerified ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-start gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            {/* Saved Searches */}
            <div className="mb-6">
              <SavedSearches
                currentSearch={{
                  location,
                  duration,
                  priceRange,
                  beds,
                  baths,
                  amenities: selectedAmenities,
                  propertyType,
                  moveInDate,
                  moveOutDate,
                }}
                onApplySearch={handleApplySavedSearch}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black dark:text-gray-100">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-black dark:text-gray-100 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-black dark:text-gray-300">Min Price: ${priceRange[0]}</label>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-black dark:text-gray-300">Max Price: ${priceRange[1]}</label>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-black dark:text-gray-100 bg-rose-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span>${priceRange[0]}</span>
                    <span>to</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-black dark:text-gray-100 mb-4">Quick Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition">
                    <input
                      type="checkbox"
                      checked={instantBook}
                      onChange={(e) => setInstantBook(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Instant Book</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Book immediately without waiting for approval</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition">
                    <input
                      type="checkbox"
                      checked={verifiedHost}
                      onChange={(e) => setVerifiedHost(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Verified Host</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Properties from verified and trusted hosts</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition">
                    <input
                      type="checkbox"
                      checked={petFriendly}
                      onChange={(e) => setPetFriendly(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Pet Friendly</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pets are welcome at this property</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition">
                    <input
                      type="checkbox"
                      checked={studentVerified}
                      onChange={(e) => setStudentVerified(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Student Verified</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Verified student-friendly properties</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Move-in/Move-out Dates */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-black dark:text-gray-100 mb-4">Dates</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-black dark:text-gray-300 mb-2">Move-in</label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-black dark:text-gray-100 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-black dark:text-gray-300 mb-2">Move-out</label>
                    <input
                      type="date"
                      value={moveOutDate}
                      onChange={(e) => setMoveOutDate(e.target.value)}
                      min={moveInDate}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-black dark:text-gray-100 dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-black dark:text-gray-100 mb-4">Property Type</h3>
                <div className="space-y-2">
                  {['', 'Apartment', 'House', 'Studio', 'Shared Room'].map((type) => (
                    <label
                      key={type || 'any'}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                    >
                      <input
                        type="radio"
                        name="propertyType"
                        checked={propertyType === type}
                        onChange={() => setPropertyType(type)}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-black dark:text-gray-300">{type || 'Any Type'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-black dark:text-gray-100 mb-4">Bedrooms</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[null, 1, 2, 3].map((num) => (
                    <button
                      key={num === null ? 'any' : num}
                      onClick={() => setBeds(num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        beds === num
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {num === null ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-black dark:text-gray-100 mb-4">Bathrooms</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[null, 1, 2, 3].map((num) => (
                    <button
                      key={num === null ? 'any' : num}
                      onClick={() => setBaths(num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        baths === num
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {num === null ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold text-black dark:text-gray-100 mb-4">Amenities</h3>
                <div className="space-y-2">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Quick Filters */}
            <SearchQuickFilters
              activeFilters={activeQuickFilters}
              onFilterToggle={handleQuickFilterToggle}
            />

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                    {properties.length} sublet{properties.length !== 1 ? 's' : ''} found
                  </h1>
                  <p className="text-black dark:text-gray-300">
                    {location && `in ${location}`}
                    {location && duration && duration !== 'Any length' && ' · '}
                    {duration && duration !== 'Any length' && `${duration} duration`}
                    {!location && (!duration || duration === 'Any length') && 'Showing all available sublets'}
                  </p>
                </div>

                {/* Mobile Filters Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Sort By and View Toggle */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-black dark:text-gray-300 hidden md:inline">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-black dark:text-gray-100 bg-white dark:bg-gray-800"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>

                {/* View Toggle */}
                <div className="hidden md:flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-md'
                        : 'text-black dark:text-gray-300 hover:text-rose-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'map'
                        ? 'bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-md'
                        : 'text-black dark:text-gray-300 hover:text-rose-600'
                    }`}
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results - Grid or Map */}
            {loading ? (
              <SearchResultsSkeleton />
            ) : properties.length > 0 ? (
              viewMode === 'map' ? (
                <PropertyMap properties={properties} />
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
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
                      <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <span className="text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                          {property.duration}
                        </span>
                      </div>
                      {/* Action Buttons */}
                      <div className="absolute top-3 left-3 flex gap-2 z-10">
                        <button
                          onClick={(e) => toggleFavorite(e, property.id)}
                          className="w-8 h-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isFavorite(property.id)
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-rose-500'
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => handleAddToComparison(e, property)}
                          className={`w-8 h-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${
                            isInComparison(property.id) ? 'ring-2 ring-purple-500' : ''
                          }`}
                        >
                          <GitCompare
                            className={`w-4 h-4 ${
                              isInComparison(property.id)
                                ? 'text-purple-600'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold dark:text-gray-100">{property.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.type} · {property.beds} bed{property.beds > 1 ? 's' : ''} · {property.baths} bath{property.baths > 1 ? 's' : ''}
                      </p>
                      <div className="flex items-baseline gap-1 pt-1">
                        <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                          ${property.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">/ month</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-medium">{property.available}</p>
                    </div>
                  </Link>
                ))}
              </div>
              )
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No sublets found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search filters</p>
                <button
                  onClick={clearFilters}
                  className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Property Comparison Floating Button & Modal */}
      <PropertyComparison />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
