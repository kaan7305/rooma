'use client';

import Link from 'next/link';
import { Zap, CalendarDays, CalendarRange, GraduationCap, CalendarClock, Home, Sparkles, Check, Shield, MessageCircle, Bookmark, MapPin, Star, Users, ArrowRight, Search, Key, ThumbsUp } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPopularSublets, allProperties } from '@/data/properties';
import { useFavoritesStore } from '@/lib/favorites-store';
import RecentlyViewed from '@/components/RecentlyViewed';
import FeaturedSections from '@/components/FeaturedSections';
import SmartSearchBar from '@/components/SmartSearchBar';

// Get popular sublets from data (limit to 4)
const popularSublets = getPopularSublets().slice(0, 4);

const subletDurations = [
  { name: '1 Week Sublet', iconName: 'zap' as const, duration: '1 week' },
  { name: '1 Month Sublet', iconName: 'calendarDays' as const, duration: '1 month' },
  { name: '3 Month Sublet', iconName: 'calendarRange' as const, duration: '3 months' },
  { name: 'Semester Sublet', iconName: 'graduationCap' as const, duration: '4-5 months' },
  { name: '6 Month Sublet', iconName: 'calendarClock' as const, duration: '6 months' },
  { name: '1 Year Sublet', iconName: 'home' as const, duration: '12 months' },
  { name: 'Flexible Duration', iconName: 'sparkles' as const, duration: 'flexible' },
];

// Compute city counts from actual data
const cities = ['New York', 'Boston', 'Los Angeles', 'San Francisco', 'Chicago', 'Seattle', 'Austin', 'Miami'];
const cityData = cities.map(city => ({
  name: city,
  count: allProperties.filter(p => p.city.toLowerCase().includes(city.toLowerCase())).length,
}));

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-20">
          {/* Hero Text */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-teal-700 dark:text-teal-400">
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
            <div className="flex items-center justify-center gap-6 overflow-x-auto pb-4 hide-scrollbar">
              {subletDurations.map((duration) => {
                return (
                  <button
                    key={duration.name}
                    onClick={() => router.push(`/search?duration=${duration.duration}`)}
                    className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 border-transparent hover:border-teal-200 dark:hover:border-teal-700 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all whitespace-nowrap group"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {renderDurationIcon(duration.iconName, "w-8 h-8 text-teal-700 dark:text-teal-400")}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {duration.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{duration.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>Trusted by 10,000+ students across 25+ cities</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* Recently Viewed Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
          <RecentlyViewed />
        </div>

        {/* Popular Sublets - White background */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Popular sublets right now
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Handpicked by our community of students and young professionals</p>
            </div>

            {/* Property Grid - 4 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularSublets.map((sublet) => (
                <Link
                  key={sublet.id}
                  href={`/properties/${sublet.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-[10px] overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                    <img
                      src={sublet.image}
                      alt={sublet.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                        {sublet.duration}
                      </span>
                    </div>
                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, sublet.id)}
                      className="absolute top-3 left-3 w-8 h-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isFavorite(sublet.id)
                            ? 'fill-teal-600 text-teal-600'
                            : 'text-teal-600'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{sublet.title}</h3>
                      <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{sublet.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{sublet.location}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{sublet.type} · {sublet.beds} bed{sublet.beds > 1 ? 's' : ''}</p>
                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
                        ${sublet.price}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">/ month</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Explore by Location - Light gray background */}
        <section className="bg-slate-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Explore by Location</h2>
              <p className="text-gray-600 dark:text-gray-300">Find your perfect sublet in popular cities</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cityData.map((city) => (
                <Link
                  key={city.name}
                  href={`/search?location=${city.name}`}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-700 p-6 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin className="w-8 h-8 text-teal-700 dark:text-teal-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{city.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{city.count} listing{city.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose ROOMA - Light teal background */}
        <section className="bg-teal-50/50 dark:bg-gray-800/50 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Why sublet with ROOMA?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                  <Check className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Verified Listings</h3>
                <p className="text-gray-600 dark:text-gray-300">Every sublet is verified with photo ID and lease documentation</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                  <Shield className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Secure Payments</h3>
                <p className="text-gray-600 dark:text-gray-300">Bank-level encryption and payment protection on all transactions</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                  <MessageCircle className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">24/7 Support</h3>
                <p className="text-gray-600 dark:text-gray-300">Our team is always here to help with any questions or issues</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-xl mx-auto">
              Find and book your next sublet in three simple steps
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-teal-200 via-teal-300 to-teal-200 dark:from-teal-800 dark:via-teal-700 dark:to-teal-800" />

              {[
                { step: 1, icon: Search, title: 'Search & Discover', desc: 'Browse verified listings by location, duration, budget, and amenities. Use our smart search to find exactly what you need.' },
                { step: 2, icon: MessageCircle, title: 'Connect & Tour', desc: 'Message hosts directly, ask questions, and schedule virtual or in-person tours before committing.' },
                { step: 3, icon: Key, title: 'Book & Move In', desc: 'Reserve your sublet with secure payment. Sign your sublease digitally and get the keys on move-in day.' },
              ].map((item) => (
                <div key={item.step} className="text-center relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/50 dark:to-teal-800/50 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 border-4 border-white dark:border-gray-900 shadow-lg">
                    <item.icon className="w-10 h-10 text-teal-700 dark:text-teal-400" />
                  </div>
                  <span className="inline-block bg-teal-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">Step {item.step}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Sections (New Listings + Best Value) */}
        <section className="bg-slate-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FeaturedSections />
          </div>
        </section>

        {/* Stats / Social Proof Bar */}
        <section className="bg-white dark:bg-gray-900 py-12 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10,000+', label: 'Happy tenants' },
                { value: '5,000+', label: 'Verified listings' },
                { value: '25+', label: 'Cities covered' },
                { value: '4.8/5', label: 'Average rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-teal-700 dark:text-teal-400">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-slate-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              What our community says
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Sarah M.', school: 'NYU Student', text: 'Found a perfect summer sublet near campus in less than a day. The verified listings gave me so much peace of mind.', rating: 5 },
                { name: 'James L.', school: 'Software Engineer', text: 'I needed a 3-month sublet during my internship. ROOMA made the whole process seamless — from search to move-in.', rating: 5 },
                { name: 'Priya K.', school: 'Graduate Student', text: 'As an international student, subletting felt scary. The secure payments and verified hosts made all the difference.', rating: 5 },
              ].map((review) => (
                <div key={review.name} className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-md">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{review.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* List Your Space CTA - Teal gradient */}
        <section className="bg-gradient-to-r from-teal-700 to-teal-900 dark:from-teal-800 dark:to-teal-950 py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Have a place to sublet?</h2>
            <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
              List your space on ROOMA and connect with verified students and young professionals looking for their next home.
            </p>
            <Link
              href="/host"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all text-lg"
            >
              List Your Space
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-4">
                Support
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li><Link href="/help" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Safety Center</Link></li>
                <li><Link href="/cancellation" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Cancellation Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-4">
                Community
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li><Link href="/blog" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Sublet Stories</Link></li>
                <li><Link href="/community" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Community Forum</Link></li>
                <li><Link href="/referrals" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Refer & Earn</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-4">
                Hosting
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li><Link href="/host" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">List Your Space</Link></li>
                <li><Link href="/host-resources" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Host Resources</Link></li>
                <li><Link href="/hosting-community" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Host Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-4">
                ROOMA
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li><Link href="/about" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Press</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} ROOMA, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              <Link href="/privacy" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Terms</Link>
              <Link href="/sitemap" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Sitemap</Link>
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
