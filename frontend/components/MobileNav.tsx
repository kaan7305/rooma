'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, MessageCircle, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Navigation - Always visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
                  active
                    ? 'text-rose-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'fill-rose-600' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full space-y-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="md:hidden fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-gray-800 z-50 shadow-2xl animate-slide-in-right">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* User Section */}
              {isAuthenticated && user ? (
                <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name || 'User'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-700">
                  <Link
                    href="/auth/login"
                    className="block w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold text-center"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/wishlists"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Wishlists
                      </Link>
                      <Link
                        href="/host"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Host Dashboard
                      </Link>
                      <Link
                        href="/host/new"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        List Your Place
                      </Link>
                      <Link
                        href="/roommate-finder"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Find Roommates
                      </Link>
                      <Link
                        href="/guest-requests"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Guest Requests
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
                      <Link
                        href="/settings"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Settings
                      </Link>
                      <Link
                        href="/notifications"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Notifications
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/search"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Browse Properties
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
