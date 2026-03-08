'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, TrendingUp, MapPin, Star, Zap } from 'lucide-react';
import { allProperties, type Property } from '@/data/properties';
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useBookingsStore } from '@/lib/bookings-store';
import { useToast } from '@/lib/toast-context';

export default function SmartRecommendations() {
  const toast = useToast();
  const { recentlyViewed } = useRecentlyViewedStore();
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { bookings } = useBookingsStore();
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [recommendationType, setRecommendationType] = useState<'smart' | 'trending' | 'new'>('smart');

  useEffect(() => {
    generateRecommendations();
  }, [recentlyViewed, favorites, bookings, recommendationType]);

  const generateRecommendations = () => {
    let scored = allProperties.map(property => {
      let score = 0;

      // Based on recently viewed properties
      recentlyViewed.forEach(viewed => {
        if (viewed.id === property.id) return; // Don't recommend same property

        // Same city - high weight
        if (viewed.city === property.city) score += 5;

        // Similar price range
        const priceDiff = Math.abs(viewed.price - property.price);
        if (priceDiff < 500) score += 4;
        else if (priceDiff < 1000) score += 2;

        // Same property type
        if (viewed.type === property.type) score += 3;

        // Similar beds/baths
        if (viewed.beds === property.beds) score += 2;
        if (viewed.baths === property.baths) score += 1;

        // Similar amenities
        const commonAmenities = property.amenities.filter(a => viewed.amenities.includes(a));
        score += commonAmenities.length * 0.5;
      });

      // Based on favorites
      favorites.forEach(favId => {
        const fav = allProperties.find(p => p.id === favId);
        if (!fav || fav.id === property.id) return;

        if (fav.city === property.city) score += 4;
        if (fav.type === property.type) score += 3;
      });

      // Based on bookings
      bookings.forEach(booking => {
        if (booking.propertyId === property.id) return;

        if (booking.property.city === property.city) score += 3;
        if (booking.property.type === property.type) score += 2;
      });

      // Boost high-rated properties
      if (property.rating >= 4.8) score += 3;
      else if (property.rating >= 4.5) score += 2;

      // Recent listings boost
      if (property.id > 40) score += 1;

      return { property, score };
    });

    // Filter out already viewed, favorited, or booked
    const viewedIds = recentlyViewed.map(p => p.id);
    const bookedIds = bookings.map(b => b.propertyId);
    scored = scored.filter(s =>
      !viewedIds.includes(s.property.id) &&
      !favorites.includes(s.property.id) &&
      !bookedIds.includes(s.property.id)
    );

    if (recommendationType === 'trending') {
      // Sort by rating and random factor
      scored.sort((a, b) => (b.property.rating + Math.random() * 0.5) - (a.property.rating + Math.random() * 0.5));
    } else if (recommendationType === 'new') {
      // Sort by id (newest first)
      scored.sort((a, b) => b.property.id - a.property.id);
    } else {
      // Smart recommendations based on score
      scored.sort((a, b) => b.score - a.score);
    }

    setRecommendations(scored.slice(0, 8).map(s => s.property));
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

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <p className="text-gray-600 text-sm">Based on your preferences and activity</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setRecommendationType('smart')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              recommendationType === 'smart'
                ? 'bg-white text-rose-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Smart
          </button>
          <button
            onClick={() => setRecommendationType('trending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              recommendationType === 'trending'
                ? 'bg-white text-rose-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Trending
          </button>
          <button
            onClick={() => setRecommendationType('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              recommendationType === 'new'
                ? 'bg-white text-rose-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-1" />
            New
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((property) => (
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

              {/* Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                Match
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
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
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-6 text-center">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold transition-colors"
        >
          View all recommendations
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
