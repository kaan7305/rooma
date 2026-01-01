'use client';

import Link from 'next/link';
import { Star, TrendingUp, GraduationCap, Award, DollarSign, Heart, MapPin } from 'lucide-react';
import { allProperties } from '@/data/properties';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useToast } from '@/lib/toast-context';

export default function FeaturedSections() {
  const toast = useToast();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  // Get different featured properties
  const newListings = allProperties.slice(0, 4); // Simulate newest
  const bestValue = [...allProperties].sort((a, b) => a.price - b.price).slice(0, 4);
  const topRated = [...allProperties].sort((a, b) => b.rating - a.rating).slice(0, 4);

  // Stable city property counts (no Math.random to prevent hydration errors)
  const cityPropertyCounts: Record<string, number> = {
    'New York': 450,
    'Boston': 320,
    'Los Angeles': 380,
    'San Francisco': 290,
    'Chicago': 270,
    'Seattle': 240,
    'Austin': 210,
    'Miami': 190,
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

  const renderPropertyCard = (property: typeof allProperties[0]) => (
    <Link
      key={property.id}
      href={`/properties/${property.id}`}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Favorite Button */}
        <button
          onClick={(e) => toggleFavorite(e, property.id)}
          className="absolute top-3 left-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite(property.id)
                ? 'fill-rose-500 text-rose-500'
                : 'text-rose-500'
            }`}
          />
        </button>
        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {property.duration}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">{property.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{property.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {property.location}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            ${property.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">/month</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-16">
      {/* New Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">New Listings</h2>
              <p className="text-gray-600 text-sm">Just added this week</p>
            </div>
          </div>
          <Link
            href="/search?sort=newest"
            className="text-rose-600 hover:text-rose-700 font-semibold text-sm flex items-center gap-1"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newListings.map(renderPropertyCard)}
        </div>
      </section>

      {/* Best Value */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Best Value</h2>
              <p className="text-gray-600 text-sm">Great properties at great prices</p>
            </div>
          </div>
          <Link
            href="/search?sort=price-low"
            className="text-rose-600 hover:text-rose-700 font-semibold text-sm flex items-center gap-1"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestValue.map(renderPropertyCard)}
        </div>
      </section>

      {/* Top Rated */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Rated</h2>
              <p className="text-gray-600 text-sm">Highest rated by guests</p>
            </div>
          </div>
          <Link
            href="/search?sort=rating"
            className="text-rose-600 hover:text-rose-700 font-semibold text-sm flex items-center gap-1"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRated.map(renderPropertyCard)}
        </div>
      </section>

      {/* Explore by Location */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore by Location</h2>
          <p className="text-gray-600">Find your perfect sublet in popular cities</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['New York', 'Boston', 'Los Angeles', 'San Francisco', 'Chicago', 'Seattle', 'Austin', 'Miami'].map((city) => (
            <Link
              key={city}
              href={`/search?location=${city}`}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-rose-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{city}</h3>
                  <p className="text-xs text-gray-500">{cityPropertyCounts[city]}+ properties</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
