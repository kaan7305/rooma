'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { MapPin, Star, SlidersHorizontal, X, Heart } from 'lucide-react';
import { allProperties, type Property } from '@/data/properties';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useListingsStore, type Listing } from '@/lib/listings-store';

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';
  const duration = searchParams.get('duration') || '';

  const [properties, setProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [beds, setBeds] = useState<number | null>(null);
  const [baths, setBaths] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const { isFavorite, addFavorite, removeFavorite, loadFavorites } = useFavoritesStore();
  const { listings, loadListings } = useListingsStore();

  useEffect(() => {
    loadFavorites();
    loadListings();
  }, [loadFavorites, loadListings]);

  const allAmenities = ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Parking', 'Gym', 'Pool', 'Pets OK', 'Backyard'];

  useEffect(() => {
    // Combine dummy properties with user listings
    const userListingsAsProperties: Property[] = listings.map((listing: Listing) => ({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      city: listing.city,
      price: listing.price,
      duration: listing.duration,
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

    setProperties(filtered);
  }, [location, duration, priceRange, beds, baths, selectedAmenities, listings]);

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
    } else {
      addFavorite(propertyId);
    }
  };

  const clearFilters = () => {
    setPriceRange([500, 5000]);
    setBeds(null);
    setBaths(null);
    setSelectedAmenities([]);
  };

  const activeFiltersCount = (beds !== null ? 1 : 0) + (baths !== null ? 1 : 0) + selectedAmenities.length +
    (priceRange[0] !== 500 || priceRange[1] !== 5000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-start gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
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
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Bedrooms</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[null, 1, 2, 3].map((num) => (
                    <button
                      key={num === null ? 'any' : num}
                      onClick={() => setBeds(num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        beds === num
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num === null ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Bathrooms</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[null, 1, 2, 3].map((num) => (
                    <button
                      key={num === null ? 'any' : num}
                      onClick={() => setBaths(num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        baths === num
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num === null ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="space-y-2">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {properties.length} sublet{properties.length !== 1 ? 's' : ''} found
                </h1>
                <p className="text-gray-600">
                  {location && `in ${location}`}
                  {location && duration && duration !== 'Any length' && ' · '}
                  {duration && duration !== 'Any length' && `${duration} duration`}
                  {!location && (!duration || duration === 'Any length') && 'Showing all available sublets'}
                </p>
              </div>

              {/* Mobile Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Results Grid */}
            {properties.length > 0 ? (
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
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No sublets found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search filters</p>
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
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
