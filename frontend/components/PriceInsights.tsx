'use client';

import { DollarSign, TrendingUp, TrendingDown, Calendar, Users, Award, AlertCircle } from 'lucide-react';

interface PriceInsightsProps {
  price: number;
  duration: string;
  propertyType: string;
  location: string;
}

export default function PriceInsights({ price, duration, propertyType, location }: PriceInsightsProps) {
  // Simulated data - in production, this would come from market data APIs
  const locationHash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Calculate average market price for similar properties
  const avgMarketPrice = Math.round(price * (0.9 + (locationHash % 20) / 100));
  const priceDifference = price - avgMarketPrice;
  const percentDifference = ((priceDifference / avgMarketPrice) * 100).toFixed(1);
  const isGoodDeal = priceDifference < 0;

  // Generate price history (last 6 months)
  const priceHistory = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
    price: Math.round(price * (0.95 + Math.random() * 0.1)),
  }));

  // Peak booking months
  const peakMonths = ['May', 'June', 'August', 'September'];
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
  const isPeakSeason = peakMonths.includes(currentMonth);

  // Demand level (simulated)
  const demandLevel = locationHash % 3 === 0 ? 'High' : locationHash % 2 === 0 ? 'Medium' : 'Low';
  const demandColor = demandLevel === 'High' ? 'text-rose-600 bg-rose-100' : demandLevel === 'Medium' ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Price Insights</h2>
          <p className="text-gray-600 text-sm">Market analysis and trends</p>
        </div>
      </div>

      {/* Value Assessment */}
      <div className={`p-6 rounded-xl border-2 mb-6 ${isGoodDeal ? 'bg-emerald-50 border-emerald-300' : 'bg-blue-50 border-blue-300'}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isGoodDeal ? (
                <TrendingDown className="w-6 h-6 text-emerald-600" />
              ) : (
                <TrendingUp className="w-6 h-6 text-blue-600" />
              )}
              <h3 className={`text-lg font-bold ${isGoodDeal ? 'text-emerald-900' : 'text-blue-900'}`}>
                {isGoodDeal ? 'Great Value!' : 'Market Rate'}
              </h3>
            </div>
            <p className={`text-sm ${isGoodDeal ? 'text-emerald-700' : 'text-blue-700'}`}>
              {isGoodDeal
                ? `This property is ${Math.abs(Number(percentDifference))}% below the average market price`
                : `This property is at market rate for similar properties in this area`
              }
            </p>
          </div>
          {isGoodDeal && (
            <Award className="w-8 h-8 text-emerald-600" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">This Property</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              ${price.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Market Average</p>
            <p className="text-2xl font-bold text-gray-900">
              ${avgMarketPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Price Trend Chart */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          6-Month Price Trend
        </h3>
        <div className="relative h-32 flex items-end justify-between gap-2">
          {priceHistory.map((item, index) => {
            const heightPercent = ((item.price - Math.min(...priceHistory.map(h => h.price))) /
              (Math.max(...priceHistory.map(h => h.price)) - Math.min(...priceHistory.map(h => h.price)))) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative group flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      index === priceHistory.length - 1
                        ? 'bg-gradient-to-t from-rose-500 to-pink-500'
                        : 'bg-gradient-to-t from-gray-300 to-gray-400'
                    }`}
                    style={{ height: `${Math.max(heightPercent, 20)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      ${item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium">{item.month}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-gray-900">Season</h4>
          </div>
          <p className="text-sm text-gray-700 mb-1">
            {isPeakSeason ? (
              <span className="text-rose-600 font-semibold">Peak Season</span>
            ) : (
              <span className="text-emerald-600 font-semibold">Off-Peak Season</span>
            )}
          </p>
          <p className="text-xs text-gray-600">
            {isPeakSeason
              ? 'High demand period - book soon!'
              : 'Great time to book with lower prices'}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-gray-900">Demand</h4>
          </div>
          <p className="text-sm mb-1">
            <span className={`font-semibold px-2 py-1 rounded-full text-xs ${demandColor}`}>
              {demandLevel} Demand
            </span>
          </p>
          <p className="text-xs text-gray-600">
            {demandLevel === 'High'
              ? 'This property is in high demand'
              : demandLevel === 'Medium'
              ? 'Moderate interest in this area'
              : 'Available properties in this area'}
          </p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Cost Breakdown
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Monthly Rent</span>
            <span className="font-semibold text-gray-900">${price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Security Deposit (est.)</span>
            <span className="font-semibold text-gray-900">${price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Service Fee (est.)</span>
            <span className="font-semibold text-gray-900">${Math.round(price * 0.1).toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-blue-300 flex items-center justify-between">
            <span className="font-bold text-gray-900">Total Move-in Cost</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${(price * 2 + Math.round(price * 0.1)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Booking Tip</h4>
            <p className="text-sm text-amber-800">
              Properties in this area typically get booked {locationHash % 2 === 0 ? '7-10 days' : '2-3 weeks'} in advance.
              {isGoodDeal && ' This is a great value - consider booking soon!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
