'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  CheckCircle,
  ShieldCheck,
  Clock,
  XCircle,
  MapPin,
  Star,
  Heart,
  Home,
  Award,
  TrendingUp
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, loadUser, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [isAuthenticated, user, router]);

  const handleSave = () => {
    if (!user) return;

    updateUser(formData);
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 h-40 sm:h-48"></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Profile Picture and Header Info */}
            <div className="relative -mt-20 sm:-mt-24 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-2xl border-4 border-white">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    {user.studentVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg border-4 border-white">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name and Email */}
                  <div className="sm:pb-4 sm:pt-64">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                      <Mail className="w-4 h-4 text-rose-500" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl sm:self-end"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {editing ? (
              /* Edit Form */
              <div className="space-y-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name
                    </label>
                    <input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name
                    </label>
                    <input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-6 mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                        <Home className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs text-gray-500">Bookings</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs text-gray-500">Favorites</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs text-gray-500">Reviews</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">New</p>
                        <p className="text-xs text-gray-500">Member</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-rose-500" />
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Full Name
                      </label>
                      <p className="text-gray-900 font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Phone Number
                      </label>
                      <p className="text-gray-900 font-medium">
                        {user.phone || <span className="text-gray-400 italic">Not provided</span>}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Member Since
                      </label>
                      <p className="text-gray-900 font-medium">
                        {new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      About Me
                    </label>
                    <p className="text-gray-700 leading-relaxed">
                      {user.bio || <span className="text-gray-400 italic">No bio yet. Click "Edit Profile" to add one!</span>}
                    </p>
                  </div>
                </div>

                {/* Verification Status */}
                <div className={`border-2 rounded-xl overflow-hidden ${
                  user.studentVerified
                    ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50'
                    : !user.studentVerified && user.emailVerified
                    ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50'
                    : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
                }`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                          user.studentVerified
                            ? 'bg-emerald-500'
                            : !user.studentVerified && user.emailVerified
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}>
                          {user.studentVerified ? (
                            <ShieldCheck className="w-7 h-7 text-white" />
                          ) : !user.studentVerified && user.emailVerified ? (
                            <Clock className="w-7 h-7 text-white" />
                          ) : (
                            <ShieldCheck className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold mb-2 ${
                            user.studentVerified
                              ? 'text-emerald-900'
                              : !user.studentVerified && user.emailVerified
                              ? 'text-yellow-900'
                              : 'text-blue-900'
                          }`}>
                            {user.studentVerified
                              ? 'Identity Verified'
                              : !user.studentVerified && user.emailVerified
                              ? 'Verification Pending'
                              : 'Get Verified'
                            }
                          </h3>
                          <p className={`text-sm leading-relaxed ${
                            user.studentVerified
                              ? 'text-emerald-700'
                              : !user.studentVerified && user.emailVerified
                              ? 'text-yellow-700'
                              : 'text-blue-700'
                          }`}>
                            {user.studentVerified
                              ? 'Your identity has been verified. This builds trust with the community and increases your booking acceptance rate.'
                              : !user.studentVerified && user.emailVerified
                              ? 'We\'re reviewing your documents. This usually takes 24-48 hours. We\'ll notify you once the review is complete.'
                              : 'Verify your identity to build trust and increase your booking acceptance rate. Verified members are 3x more likely to get bookings.'
                            }
                          </p>
                        </div>
                      </div>
                      {!user.studentVerified && (
                        <Link
                          href="/verify"
                          className="px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Verify Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-rose-500" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/bookings"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-xl transition-all group"
                    >
                      <span className="font-semibold text-gray-900">View My Bookings</span>
                      <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 rounded-xl transition-all group"
                    >
                      <span className="font-semibold text-gray-900">View Favorites</span>
                      <span className="text-rose-600 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-xl transition-all group"
                    >
                      <span className="font-semibold text-gray-900">Account Settings</span>
                      <span className="text-purple-600 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-xl transition-all group"
                    >
                      <span className="font-semibold text-gray-900">My Messages</span>
                      <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
