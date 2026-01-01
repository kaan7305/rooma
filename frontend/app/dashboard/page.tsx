'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import DashboardStats from '@/components/DashboardStats';
import ActivityTimeline from '@/components/ActivityTimeline';
import QuickActions from '@/components/QuickActions';
import RecentlyViewed from '@/components/RecentlyViewed';
import SmartRecommendations from '@/components/SmartRecommendations';
import { Settings, Bell, Shield, BadgeCheck } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    // Load user data on mount
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 dark:from-gray-100 to-gray-700 dark:to-gray-300 bg-clip-text text-transparent">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/notifications"
                className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all group"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-rose-600 transition-colors" />
              </Link>
              <Link
                href="/settings"
                className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center transition-all group"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-rose-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-3">
            {user.emailVerified && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Email Verified</span>
              </div>
            )}
            {user.studentVerified && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Student Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Activity */}
          <div className="lg:col-span-2">
            <ActivityTimeline />
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Recently Viewed */}
        <div>
          <RecentlyViewed />
        </div>

        {/* Smart Recommendations */}
        <div className="mt-8">
          <SmartRecommendations />
        </div>

        {/* User Info Cards (kept from original) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Student</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.userType === 'student' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {user.userType === 'student' ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Host</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_host ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {user.is_host ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Verified</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.studentVerified ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  }`}
                >
                  {user.studentVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition">
                <p className="font-medium text-gray-900 dark:text-gray-100">Browse Properties</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Find your next home</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition">
                <p className="font-medium text-gray-900 dark:text-gray-100">My Bookings</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">View your reservations</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition">
                <p className="font-medium text-gray-900 dark:text-gray-100">Settings</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account</p>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Active Bookings</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Wishlisted</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Reviews</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Messages</p>
          </div>
        </div>
      </main>
    </div>
  );
}
