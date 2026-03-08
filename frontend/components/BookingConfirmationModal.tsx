'use client';

import { X, Calendar, Users, DollarSign, MapPin, Check, AlertCircle, CreditCard } from 'lucide-react';
import { type Property } from '@/data/properties';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  days: number;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  property,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  days,
}: BookingConfirmationModalProps) {
  if (!isOpen) return null;

  const serviceFee = Math.round(totalPrice * 0.1);
  const cleaningFee = 50;
  const finalTotal = totalPrice + serviceFee + cleaningFee;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Confirm Your Booking</h2>
                <p className="text-white/90 text-sm">Review your reservation details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 hover:bg-white/20 rounded-xl flex items-center justify-center transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Property Info */}
          <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
            <img
              src={property.image}
              alt={property.title}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{property.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" />
                {property.location}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-medium">
                  {property.type}
                </span>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium">
                  {property.beds} bed · {property.baths} bath
                </span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Booking Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-600 dark:text-blue-300 font-medium mb-1">Check-in</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {new Date(checkIn).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">After 3:00 PM</p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                <p className="text-xs text-purple-600 dark:text-purple-300 font-medium mb-1">Check-out</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {new Date(checkOut).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-300">Before 11:00 AM</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
                <p className="text-xs text-green-600 dark:text-green-300 font-medium mb-1">Duration</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{days} {days === 1 ? 'Day' : 'Days'}</p>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-xs text-orange-600 dark:text-orange-300 font-medium">Guests</p>
                </div>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Price Breakdown
            </h3>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  ${Math.round(property.price / 30).toLocaleString()} × {days} {days === 1 ? 'day' : 'days'}
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">${totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Service fee</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">${serviceFee.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Cleaning fee</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">${cleaningFee}</span>
              </div>

              <div className="pt-3 border-t border-gray-300 dark:border-gray-700 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total (USD)</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${finalTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Payment Information</h4>
                <p className="text-sm text-blue-800">
                  You won't be charged yet. The host has 24 hours to accept your booking request.
                  Payment will be processed only after acceptance.
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Cancellation Policy</h4>
                <p className="text-sm text-amber-800">
                  Free cancellation for 48 hours after booking. Cancel before check-in on{' '}
                  {new Date(new Date(checkIn).getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  for a partial refund.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Confirm Booking
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By confirming, you agree to the{' '}
            <a href="/terms" className="text-rose-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-rose-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
