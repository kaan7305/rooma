'use client';

import { Zap, DollarSign, Star, Home, GraduationCap, Shield, X } from 'lucide-react';

interface SearchQuickFiltersProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

export default function SearchQuickFilters({ activeFilters, onFilterToggle }: SearchQuickFiltersProps) {
  const quickFilters = [
    {
      id: 'instant-book',
      label: 'Instant Book',
      icon: Zap,
      description: 'Book without waiting for approval',
    },
    {
      id: 'under-2000',
      label: 'Under $2000',
      icon: DollarSign,
      description: 'Affordable options',
    },
    {
      id: 'top-rated',
      label: 'Top Rated',
      icon: Star,
      description: '4.5+ rating',
    },
    {
      id: 'entire-place',
      label: 'Entire Place',
      icon: Home,
      description: 'Full apartment or house',
    },
    {
      id: 'student-friendly',
      label: 'Student Friendly',
      icon: GraduationCap,
      description: 'Near universities',
    },
    {
      id: 'verified-host',
      label: 'Verified Host',
      icon: Shield,
      description: 'Trusted hosts only',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-semibold text-gray-900">Quick Filters</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={() => activeFilters.forEach(filter => onFilterToggle(filter))}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {quickFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.id);

          return (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all whitespace-nowrap group ${
                isActive
                  ? 'border-rose-500 bg-gradient-to-r from-rose-50 to-pink-50 shadow-md'
                  : 'border-gray-200 hover:border-rose-200 hover:bg-gray-50'
              }`}
              title={filter.description}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-rose-600' : 'text-gray-500 group-hover:text-rose-500'
                }`}
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-rose-600' : 'text-gray-700 group-hover:text-gray-900'
                }`}
              >
                {filter.label}
              </span>
              {isActive && (
                <X className="w-3 h-3 text-rose-600" />
              )}
            </button>
          );
        })}
      </div>

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
