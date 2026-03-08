'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, DollarSign, MessageCircle, Download, Filter, Search, CheckCircle, XCircle, AlertCircle, MoreVertical, Eye } from 'lucide-react';
import { type Booking } from '@/lib/bookings-store';
import { useToast } from '@/lib/toast-context';

interface BookingsManagerProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
}

type BookingStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function BookingsManager({ bookings, onCancelBooking }: BookingsManagerProps) {
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');

  const filteredBookings = bookings
    .filter(booking => {
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesSearch = booking.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           booking.property.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
      }
      return b.totalPrice - a.totalPrice;
    });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    upcoming: bookings.filter(b => new Date(b.checkIn) > new Date() && b.status === 'confirmed').length,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const handleDownloadReceipt = (booking: Booking) => {
    toast.success('Receipt downloaded successfully');
    // In production, this would trigger actual PDF download
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-rose-500">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-500">
          <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-gray-900">{stats.upcoming}</div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            const isUpcoming = new Date(booking.checkIn) > new Date();

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                    <img
                      src={booking.property.image}
                      alt={booking.property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isUpcoming && booking.status === 'confirmed' && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                        Upcoming
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link
                          href={`/properties/${booking.propertyId}`}
                          className="text-xl font-bold text-gray-900 hover:text-rose-600 transition-colors mb-2 block"
                        >
                          {booking.property.title}
                        </Link>
                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{booking.property.location}</span>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>

                      {/* Actions Menu */}
                      <div className="relative group/menu">
                        <button className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                          <Link
                            href={`/properties/${booking.propertyId}`}
                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-xl"
                          >
                            <Eye className="w-4 h-4" />
                            View Property
                          </Link>
                          <button
                            onClick={() => handleDownloadReceipt(booking)}
                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 w-full text-left"
                          >
                            <Download className="w-4 h-4" />
                            Download Receipt
                          </button>
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => onCancelBooking(booking.id)}
                              className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-sm text-red-600 w-full text-left last:rounded-b-xl"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-medium">Check-in</span>
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">{formatDate(booking.checkIn)}</div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-medium">Check-out</span>
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">{formatDate(booking.checkOut)}</div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">Duration</span>
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">{nights} night{nights > 1 ? 's' : ''}</div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-xs font-medium">Guests</span>
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ${booking.totalPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-600">total</span>
                      </div>

                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-semibold text-sm">
                        <MessageCircle className="w-4 h-4" />
                        Contact Host
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
