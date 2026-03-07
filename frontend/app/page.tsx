'use client';

import Link from 'next/link';
import { Zap, CalendarDays, CalendarRange, GraduationCap, CalendarClock, Home, Sparkles, Check, Shield, MessageCircle, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPopularSublets } from '@/data/properties';
import { useFavoritesStore } from '@/lib/favorites-store';
import RecentlyViewed from '@/components/RecentlyViewed';
import FeaturedSections from '@/components/FeaturedSections';
import SmartSearchBar from '@/components/SmartSearchBar';

// Get popular sublets from data
const popularSublets = getPopularSublets();

const subletDurations = [
  { name: '1 Week Sublet', iconName: 'zap' as const, duration: '1 week' },
  { name: '1 Month Sublet', iconName: 'calendarDays' as const, duration: '1 month' },
  { name: '3 Month Sublet', iconName: 'calendarRange' as const, duration: '3 months' },
  { name: 'Semester Sublet', iconName: 'graduationCap' as const, duration: '4-5 months' },
  { name: '6 Month Sublet', iconName: 'calendarClock' as const, duration: '6 months' },
  { name: '1 Year Sublet', iconName: 'home' as const, duration: '12 months' },
  { name: 'Flexible Duration', iconName: 'sparkles' as const, duration: 'flexible' },
];

export default function HomePage() {
  const router = useRouter();

  const renderDurationIcon = (iconName: 'zap' | 'calendarDays' | 'calendarRange' | 'graduationCap' | 'calendarClock' | 'home' | 'sparkles', className: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap className={className} />;
      case 'calendarDays':
        return <CalendarDays className={className} />;
      case 'calendarRange':
        return <CalendarRange className={className} />;
      case 'graduationCap':
        return <GraduationCap className={className} />;
      case 'calendarClock':
        return <CalendarClock className={className} />;
      case 'home':
        return <Home className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
    }
  };
  const { loadFavorites, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(propertyId)) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section with Search */}
      <section className="relative">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-20">
          {/* Hero Text */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-rose-600 dark:text-rose-400">
                Find Your Perfect Sublet
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From weekly stays to yearly leases - discover verified sublets near you
            </p>
          </div>

          {/* Smart Search Bar */}
          <SmartSearchBar placeholder='Try "2 bed apartment in Boston under $2000" or "pet friendly near NYU"' />

          {/* Sublet Duration Categories */}
          <div className="mt-12 relative">
            <div className="flex items-center gap-6 overflow-x-auto pb-4 hide-scrollbar">
              {subletDurations.map((duration) => {
                return (
                  <button
                    key={duration.name}
                    onClick={() => router.push(`/search?duration=${duration.duration}`)}
                    className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 border-transparent hover:border-rose-200 hover:bg-white/80 transition-all whitespace-nowrap group"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {renderDurationIcon(duration.iconName, "w-8 h-8 text-rose-600")}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-rose-600 transition-colors">
                      {duration.name}
                    </span>
                    <span className="text-xs text-gray-500">{duration.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-0 pb-12">
        {/* Recently Viewed Section */}
        <RecentlyViewed />

        {/* Section Title */}
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Popular sublets right now
          </h2>
          <p className="text-gray-600 mt-2">Handpicked by our community of students and young professionals</p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularSublets.map((sublet) => (
            <Link
              key={sublet.id}
              href={`/properties/${sublet.id}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                <img
                  src={sublet.image}
                  alt={sublet.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {sublet.duration}
                  </span>
                </div>
                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(e, sublet.id)}
                  className="absolute top-3 left-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite(sublet.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-rose-500'
                    }`}
                  />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{sublet.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-sm">★</span>
                    <span className="text-sm font-semibold">{sublet.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{sublet.location}</p>
                <p className="text-sm text-gray-500">{sublet.type} · {sublet.beds} bed{sublet.beds > 1 ? 's' : ''}</p>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    ${sublet.price}
                  </span>
                  <span className="text-sm text-gray-600">/ month</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Sections */}
        <div className="mt-24">
          <FeaturedSections />
        </div>

        {/* Why Choose ROOMA */}
        <section className="mt-24 bg-gradient-to-br from-white via-rose-50/30 to-purple-50/30 rounded-3xl p-12 shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fade-in">
            Why sublet with ROOMA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                <Check className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Verified Listings</h3>
              <p className="text-black">Every sublet is verified with photo ID and lease documentation</p>
            </div>
            <div className="text-center group animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                <Shield className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Secure Payments</h3>
              <p className="text-black">Bank-level encryption and payment protection on all transactions</p>
            </div>
            <div className="text-center group animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                <MessageCircle className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">24/7 Support</h3>
              <p className="text-black">Our team is always here to help with any questions or issues</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-4">
                Support
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-rose-600 transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-rose-600 transition-colors">Safety Center</Link></li>
                <li><Link href="/cancellation" className="hover:text-rose-600 transition-colors">Cancellation Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-4">
                Community
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/blog" className="hover:text-rose-600 transition-colors">Sublet Stories</Link></li>
                <li><Link href="/community" className="hover:text-rose-600 transition-colors">Community Forum</Link></li>
                <li><Link href="/referrals" className="hover:text-rose-600 transition-colors">Refer & Earn</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-4">
                Hosting
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/host" className="hover:text-rose-600 transition-colors">List Your Space</Link></li>
                <li><Link href="/host-resources" className="hover:text-rose-600 transition-colors">Host Resources</Link></li>
                <li><Link href="/hosting-community" className="hover:text-rose-600 transition-colors">Host Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-4">
                ROOMA
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-rose-600 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-rose-600 transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-rose-600 transition-colors">Press</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-2 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2024 ROOMA, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-rose-600 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-rose-600 transition-colors">Terms</Link>
              <Link href="/sitemap" className="hover:text-rose-600 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
