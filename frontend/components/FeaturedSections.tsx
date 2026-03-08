'use client';

import Link from 'next/link';
import { Star, TrendingUp, DollarSign, Bookmark, MapPin } from 'lucide-react';
import { allProperties } from '@/data/properties';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useToast } from '@/lib/toast-context';

export default function FeaturedSections() {
  const toast = useToast();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  // Get different featured properties
  const newListings = allProperties.slice(0, 4);
  const bestValue = [...allProperties].sort((a, b) => a.price - b.price).slice(0, 4);

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
      <div className="relative aspect-[4/3] rounded-[10px] overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Bookmark Button */}
        <button
          onClick={(e) => toggleFavorite(e, property.id)}
          className="absolute top-3 left-3 w-8 h-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
        >
          <Bookmark
            className={`w-4 h-4 ${
              isFavorite(property.id)
                ? 'fill-teal-600 text-teal-600'
                : 'text-teal-600'
            }`}
          />
        </button>
        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
            {property.duration}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 flex-1">{property.title}</h3>
          <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{property.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {property.location}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
            ${property.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">/month</span>
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
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">New Listings</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Just added this week</p>
            </div>
          </div>
          <Link
            href="/search?sort=newest"
            className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold text-sm flex items-center gap-1"
          >
            View all &rarr;
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
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Best Value</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Great properties at great prices</p>
            </div>
          </div>
          <Link
            href="/search?sort=price-low"
            className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold text-sm flex items-center gap-1"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestValue.map(renderPropertyCard)}
        </div>
      </section>
    </div>
  );
}
