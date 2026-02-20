'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useNotificationsStore } from '@/lib/notifications-store';
import { useEffect, useState } from 'react';
import { Home, Heart, Calendar, Building2, MessageCircle, Bell, GraduationCap, Shield, ArrowLeftRight, ChevronDown, Briefcase, UserPlus, HomeIcon, ListChecks, Settings, User, LogOut, CreditCard, MapPin as MapPinIcon, HelpCircle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loadUser, logout } = useAuthStore();
  const { favorites, guestRequestFavorites, roommateFavorites, loadFavorites } = useFavoritesStore();
  const { loadNotifications, getUnreadCount } = useNotificationsStore();

  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isHostMenuOpen, setIsHostMenuOpen] = useState(false);
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
    loadFavorites();
    loadNotifications();
  }, [loadUser, loadFavorites, loadNotifications]);

  useEffect(() => {
    if (user) {
      const count = getUnreadCount(user.id);
      setUnreadNotifications(count);
    }
  }, [user, getUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isHostMenuOpen && !target.closest('.host-menu-container')) {
        setIsHostMenuOpen(false);
      }
      if (isGuestMenuOpen && !target.closest('.guest-menu-container')) {
        setIsGuestMenuOpen(false);
      }
      if (isStudentMenuOpen && !target.closest('.student-menu-container')) {
        setIsStudentMenuOpen(false);
      }
      if (isProfileMenuOpen && !target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHostMenuOpen, isGuestMenuOpen, isStudentMenuOpen, isProfileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const totalFavorites = favorites.length + guestRequestFavorites.length + roommateFavorites.length;

  // For Host menu items
  const hostMenuItems = [
    { href: '/host', label: 'List Property', iconName: 'building' as const },
    { href: '/bookings', label: 'My Bookings', iconName: 'calendar' as const },
    { href: '/guest-requests', label: 'Guest Requests', iconName: 'requests' as const },
  ];

  // For Guest menu items
  const guestMenuItems = [
    { href: '/search', label: 'Browse Properties', iconName: 'home' as const },
    { href: '/bookings', label: 'My Trips', iconName: 'calendar' as const },
    { href: '/roommate-finder', label: 'Roommate Finder', iconName: 'roommate' as const },
  ];

  // Students menu items
  const studentMenuItems = [
    { href: '/student-verification', label: 'Student Verify', iconName: 'student' as const },
    { href: '/exchange-places', label: 'Exchange Places', iconName: 'exchange' as const },
  ];

  const renderIcon = (iconName: 'home' | 'heart' | 'calendar' | 'building' | 'messages' | 'student' | 'admin' | 'exchange' | 'requests' | 'roommate', className: string) => {
    switch (iconName) {
      case 'home':
        return <Home className={className} />;
      case 'heart':
        return <Heart className={className} />;
      case 'messages':
        return <MessageCircle className={className} />;
      case 'calendar':
        return <Calendar className={className} />;
      case 'building':
        return <Building2 className={className} />;
      case 'student':
        return <GraduationCap className={className} />;
      case 'admin':
        return <Shield className={className} />;
      case 'exchange':
        return <ArrowLeftRight className={className} />;
      case 'requests':
        return <Briefcase className={className} />;
      case 'roommate':
        return <UserPlus className={className} />;
    }
  };

  // Helper to check if any submenu item is active
  const isAnyHostItemActive = hostMenuItems.some(item => pathname === item.href);
  const isAnyGuestItemActive = guestMenuItems.some(item => pathname === item.href);
  const isAnyStudentItemActive = studentMenuItems.some(item => pathname === item.href);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">ROOMA</h1>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Favorites */}
            <Link
              href="/favorites"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 relative ${
                pathname === '/favorites'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              Favorites
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Messages */}
            {isAuthenticated && (
              <Link
                href="/messages"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  pathname === '/messages'
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </Link>
            )}

            {/* For Host Dropdown */}
            {isAuthenticated && (
              <div className="relative host-menu-container">
                <button
                  onClick={() => setIsHostMenuOpen(!isHostMenuOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isAnyHostItemActive
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  For Host
                  <ChevronDown className={`w-3 h-3 transition-transform ${isHostMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isHostMenuOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white shadow-lg rounded-lg border border-gray-200 py-1 min-w-[200px] z-50">
                    {hostMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsHostMenuOpen(false)}
                        className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition ${
                          pathname === item.href
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {renderIcon(item.iconName, "w-4 h-4")}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* For Guest Dropdown */}
            {isAuthenticated && (
              <div className="relative guest-menu-container">
                <button
                  onClick={() => setIsGuestMenuOpen(!isGuestMenuOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isAnyGuestItemActive
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  For Guest
                  <ChevronDown className={`w-3 h-3 transition-transform ${isGuestMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGuestMenuOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white shadow-lg rounded-lg border border-gray-200 py-1 min-w-[200px] z-50">
                    {guestMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsGuestMenuOpen(false)}
                        className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition ${
                          pathname === item.href
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {renderIcon(item.iconName, "w-4 h-4")}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Students Dropdown */}
            {isAuthenticated && (
              <div className="relative student-menu-container">
                <button
                  onClick={() => setIsStudentMenuOpen(!isStudentMenuOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isAnyStudentItemActive
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Students
                  <ChevronDown className={`w-3 h-3 transition-transform ${isStudentMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isStudentMenuOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white shadow-lg rounded-lg border border-gray-200 py-1 min-w-[200px] z-50">
                    {studentMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsStudentMenuOpen(false)}
                        className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition ${
                          pathname === item.href
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {renderIcon(item.iconName, "w-4 h-4")}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Admin Panel (for admins only) */}
            {isAuthenticated && user?.is_admin && (
              <Link
                href="/admin/verifications"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  pathname === '/admin/verifications'
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <ThemeToggle />

                <Link
                  href="/notifications"
                  className="relative p-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-sm font-semibold text-white">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.firstName}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-lg border border-gray-200 py-2 min-w-[240px] z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          href="/settings/payments"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Payments & Payouts</span>
                        </Link>
                        <Link
                          href="/settings/addresses"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <MapPinIcon className="w-4 h-4" />
                          <span>Saved Addresses</span>
                        </Link>
                        <Link
                          href="/help"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Help & Support</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {/* Favorites */}
            <Link
              href="/favorites"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition relative ${
                pathname === '/favorites'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              Favorites
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Messages */}
            {isAuthenticated && (
              <Link
                href="/messages"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  pathname === '/messages'
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </Link>
            )}

            {/* For Host - Mobile (all items expanded) */}
            {isAuthenticated && hostMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  pathname === item.href
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {renderIcon(item.iconName, "w-4 h-4")}
                {item.label}
              </Link>
            ))}

            {/* For Guest - Mobile (all items expanded) */}
            {isAuthenticated && guestMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  pathname === item.href
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {renderIcon(item.iconName, "w-4 h-4")}
                {item.label}
              </Link>
            ))}

            {/* Students - Mobile (all items expanded) */}
            {isAuthenticated && studentMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  pathname === item.href
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {renderIcon(item.iconName, "w-4 h-4")}
                {item.label}
              </Link>
            ))}

            {/* Admin - Mobile */}
            {isAuthenticated && user?.is_admin && (
              <Link
                href="/admin/verifications"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  pathname === '/admin/verifications'
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
