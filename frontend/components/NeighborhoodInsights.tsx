'use client';

import { MapPin, Train, Footprints, ShieldCheck, GraduationCap, Store, UtensilsCrossed, Coffee, ShoppingBag, Dumbbell, TreePine, TrendingUp } from 'lucide-react';

interface NeighborhoodInsightsProps {
  location: string;
  city: string;
}

export default function NeighborhoodInsights({ location, city }: NeighborhoodInsightsProps) {
  // Simulated data - in production, this would come from APIs like Google Places, Walk Score, etc.
  const getNeighborhoodData = () => {
    // Generate pseudo-random but consistent scores based on location
    const locationHash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return {
      walkScore: 70 + (locationHash % 30),
      transitScore: 60 + (locationHash % 35),
      safetyRating: 4.0 + (locationHash % 10) / 10,
      nearbyPlaces: [
        { type: 'Grocery Stores', icon: Store, count: 3 + (locationHash % 5), distance: '0.3 mi' },
        { type: 'Restaurants', icon: UtensilsCrossed, count: 15 + (locationHash % 20), distance: '0.2 mi' },
        { type: 'Coffee Shops', icon: Coffee, count: 5 + (locationHash % 8), distance: '0.1 mi' },
        { type: 'Shopping', icon: ShoppingBag, count: 8 + (locationHash % 10), distance: '0.5 mi' },
        { type: 'Fitness Centers', icon: Dumbbell, count: 2 + (locationHash % 4), distance: '0.4 mi' },
        { type: 'Parks', icon: TreePine, count: 4 + (locationHash % 6), distance: '0.6 mi' },
      ],
      universities: [
        { name: 'Boston University', distance: '1.2 mi', commute: '15 min by transit' },
        { name: 'MIT', distance: '2.5 mi', commute: '20 min by transit' },
        { name: 'Harvard University', distance: '3.1 mi', commute: '25 min by transit' },
      ].filter((_, i) => i < 2 + (locationHash % 2)),
    };
  };

  const data = getNeighborhoodData();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Walker's Paradise";
    if (score >= 70) return 'Very Walkable';
    if (score >= 50) return 'Somewhat Walkable';
    return 'Car-Dependent';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Neighborhood Insights</h2>
          <p className="text-gray-600 text-sm">{location}, {city}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Walk Score */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Footprints className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Walk Score</p>
              <div className={`text-2xl font-bold ${getScoreColor(data.walkScore).split(' ')[0]}`}>
                {data.walkScore}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">{getScoreLabel(data.walkScore)}</p>
        </div>

        {/* Transit Score */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Train className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Transit Score</p>
              <div className={`text-2xl font-bold ${getScoreColor(data.transitScore).split(' ')[0]}`}>
                {data.transitScore}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Excellent Transit</p>
        </div>

        {/* Safety Rating */}
        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Safety Rating</p>
              <div className="text-2xl font-bold text-rose-600">
                {data.safetyRating.toFixed(1)}/5.0
              </div>
            </div>
          </div>
          <div className="flex gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-3 h-3 rounded-full ${
                  star <= Math.round(data.safetyRating) ? 'bg-rose-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Universities */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Nearby Universities</h3>
        </div>
        <div className="space-y-3">
          {data.universities.map((university, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
            >
              <div>
                <p className="font-semibold text-gray-900">{university.name}</p>
                <p className="text-sm text-gray-600">{university.commute}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-purple-600">{university.distance}</p>
                <p className="text-xs text-gray-500">away</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Amenities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">What's Nearby</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.nearbyPlaces.map((place, index) => {
            const Icon = place.icon;
            return (
              <div
                key={index}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">{place.type}</p>
                    <p className="text-lg font-bold text-gray-900">{place.count}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Within {place.distance}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Scores and data are estimates based on location. Actual walkability, transit access, and amenities may vary.
        </p>
      </div>
    </div>
  );
}
