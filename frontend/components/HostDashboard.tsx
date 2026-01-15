'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home,
  DollarSign,
  Calendar,
  TrendingUp,
  Eye,
  Star,
  Users,
  Plus,
  BarChart3,
  MessageSquare,
  Settings,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useHostStore } from '@/lib/host-store';
import { useToast } from '@/lib/toast-context';

export default function HostDashboard() {
  const toast = useToast();
  const {
    properties,
    bookingRequests,
    revenueData,
    totalRevenue,
    totalBookings,
    activeListings,
    loadHostData,
    updateBookingRequest,
  } = useHostStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings' | 'analytics'>('overview');

  useEffect(() => {
    loadHostData();
  }, [loadHostData]);

  const pendingRequests = bookingRequests.filter(r => r.status === 'pending').length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const avgRating = properties.length > 0
    ? properties.reduce((sum, p) => sum + p.averageRating, 0) / properties.length
    : 0;

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      change: '+12%',
    },
    {
      label: 'Active Listings',
      value: activeListings,
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      change: '+2',
    },
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      change: '+8',
    },
    {
      label: 'Avg Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      change: '+0.2',
    },
  ];

  const handleBookingAction = (requestId: string, action: 'approved' | 'declined') => {
    updateBookingRequest(requestId, action);
    toast.success(action === 'approved' ? 'Booking request approved!' : 'Booking request declined');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your properties and bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/host/properties/new"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Link>
          <Link
            href="/host/settings"
            className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-emerald-600">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'properties', label: 'Properties', icon: Home },
              { id: 'bookings', label: 'Booking Requests', icon: Calendar, badge: pendingRequests },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-rose-600 border-b-2 border-rose-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Booking Requests */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-rose-600" />
                    Recent Requests
                  </h3>
                  <div className="space-y-3">
                    {bookingRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{request.guestName}</p>
                            <p className="text-sm text-gray-600">{request.propertyTitle}</p>
                          </div>
                          <span className="text-xs text-gray-500">{formatTimeAgo(request.requestDate)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatDate(request.checkIn)} - {formatDate(request.checkOut)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBookingAction(request.id, 'approved')}
                            className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleBookingAction(request.id, 'declined')}
                            className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performing Properties */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-rose-600" />
                    Top Properties
                  </h3>
                  <div className="space-y-3">
                    {properties
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 3)
                      .map((property) => (
                        <div key={property.id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{property.title}</p>
                              <p className="text-sm text-gray-600">{property.location}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm font-semibold text-emerald-600">
                                  ${property.revenue.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {property.bookingsCount} bookings
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Properties</h3>
                <Link
                  href="/host/properties/new"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{property.title}</h4>
                          <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          property.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                        <div className="text-center p-2 bg-white rounded-lg">
                          <Eye className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                          <p className="font-semibold">{property.views}</p>
                          <p className="text-xs text-gray-500">views</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                          <p className="font-semibold">{property.bookingsCount}</p>
                          <p className="text-xs text-gray-500">bookings</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <DollarSign className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                          <p className="font-semibold">${property.revenue / 1000}k</p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/host/properties/${property.id}/edit`}
                          className="flex-1 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors text-center"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/properties/${property.id}`}
                          className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors text-center"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Requests</h3>
              {bookingRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={request.propertyImage}
                      alt={request.propertyTitle}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{request.propertyTitle}</h4>
                          <p className="text-sm text-gray-600">
                            Requested by <span className="font-semibold">{request.guestName}</span>
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : request.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Check-in</p>
                          <p className="font-semibold">{formatDate(request.checkIn)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Check-out</p>
                          <p className="font-semibold">{formatDate(request.checkOut)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="font-semibold text-emerald-600">${request.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      {request.message && (
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookingAction(request.id, 'approved')}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleBookingAction(request.id, 'declined')}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </button>
                          <Link
                            href={`/messages?guest=${request.guestId}`}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Analytics</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Last 6 Months</h4>
                <div className="flex items-end gap-2 h-64">
                  {revenueData.map((data, index) => {
                    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                    const height = (data.revenue / maxRevenue) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col items-center">
                          <span className="text-xs font-semibold text-emerald-600 mb-1">
                            ${data.revenue}
                          </span>
                          <div
                            className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:from-emerald-600 hover:to-teal-600"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-900">{data.month}</p>
                          <p className="text-xs text-gray-500">{data.bookings} bookings</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
