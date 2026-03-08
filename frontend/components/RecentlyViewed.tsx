'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store';
import { type Property } from '@/data/properties';

export default function RecentlyViewed() {
  const { recentlyViewed } = useRecentlyViewedStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server
  if (!mounted || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Recently Viewed
          </h2>
          <p className="text-black">Pick up where you left off</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentlyViewed.slice(0, 4).map((property) => (
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
              {/* Duration Badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {property.duration}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-black line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {property.title}
                </h3>
                {property.rating > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-black">{property.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-black mb-2">{property.location}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-black">
                  ${property.price.toLocaleString()}
                </span>
                <span className="text-sm text-black">/month</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
