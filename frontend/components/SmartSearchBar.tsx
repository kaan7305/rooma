'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, MapPin, GraduationCap, Clock, Sparkles,
  DollarSign, Bed, Home, PawPrint, Zap,
} from 'lucide-react';
import {
  parseNaturalLanguage,
  getAutocompleteSuggestions,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  type ParsedSearch,
  type SearchSuggestion,
} from '@/lib/smart-search';

interface SmartSearchBarProps {
  onSearch?: (parsed: ParsedSearch, rawQuery: string) => void;
  initialQuery?: string;
  placeholder?: string;
  compact?: boolean;
}

export default function SmartSearchBar({ onSearch, initialQuery = '', placeholder, compact = false }: SmartSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [parsedPreview, setParsedPreview] = useState<ParsedSearch | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      setSuggestions(getAutocompleteSuggestions(query));
      setParsedPreview(parseNaturalLanguage(query));
    } else {
      setSuggestions([]);
      setParsedPreview(null);
    }
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const parsed = parseNaturalLanguage(searchQuery);
    addRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
    setIsFocused(false);

    if (onSearch) {
      onSearch(parsed, searchQuery);
    } else {
      // Navigate to search page with smart params
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (parsed.location) params.set('location', parsed.location);
      if (parsed.minPrice) params.set('minPrice', String(parsed.minPrice));
      if (parsed.maxPrice) params.set('maxPrice', String(parsed.maxPrice));
      if (parsed.beds) params.set('beds', String(parsed.beds));
      if (parsed.baths) params.set('baths', String(parsed.baths));
      if (parsed.propertyType) params.set('type', parsed.propertyType);
      if (parsed.duration) params.set('duration', parsed.duration);
      if (parsed.petFriendly) params.set('pets', '1');
      if (parsed.amenities.length > 0) params.set('amenities', parsed.amenities.join(','));
      router.push(`/search?${params.toString()}`);
    }
  }, [onSearch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = suggestions.length > 0 ? suggestions : recentSearches.map(s => ({ value: s }));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = items[selectedIndex];
      setQuery(selected.value);
      executeSearch(selected.value);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'city': return <MapPin className="w-4 h-4 text-teal-600" />;
      case 'university': return <GraduationCap className="w-4 h-4 text-teal-600" />;
      case 'query': return <Search className="w-4 h-4 text-gray-400" />;
      default: return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const showDropdown = isFocused && (suggestions.length > 0 || recentSearches.length > 0 || (parsedPreview && query.length >= 3));

  return (
    <div ref={containerRef} className={`relative ${compact ? 'w-full' : 'w-full max-w-3xl mx-auto'}`}>
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center bg-white dark:bg-gray-800 border-2 transition-all ${
          isFocused
            ? 'border-teal-600 shadow-lg shadow-teal-600/10'
            : 'border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg'
        } ${compact ? 'rounded-xl' : 'rounded-2xl'}`}>
          <div className="pl-4 pr-2">
            <Sparkles className={`w-5 h-5 transition-colors ${isFocused ? 'text-teal-600' : 'text-gray-400'}`} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Try "2 bed apartment in Boston under $2000"'}
            className={`flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 ${
              compact ? 'py-3 text-sm' : 'py-4 text-base'
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition mr-1"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            type="submit"
            className={`bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white font-semibold transition-all ${
              compact
                ? 'px-4 py-2 rounded-lg mr-1.5 text-sm'
                : 'px-6 py-3 rounded-xl mr-2 text-base'
            }`}
          >
            <Search className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">

          {/* Parsed Preview Chips */}
          {parsedPreview && query.length >= 3 && (
            <div className="px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Smart Search understands</p>
              <div className="flex flex-wrap gap-2">
                {parsedPreview.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                    <MapPin className="w-3 h-3" /> {parsedPreview.location}
                  </span>
                )}
                {(parsedPreview.minPrice || parsedPreview.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                    <DollarSign className="w-3 h-3" />
                    {parsedPreview.minPrice && parsedPreview.maxPrice
                      ? `$${parsedPreview.minPrice} - $${parsedPreview.maxPrice}`
                      : parsedPreview.maxPrice
                        ? `Under $${parsedPreview.maxPrice}`
                        : `$${parsedPreview.minPrice}+`
                    }
                  </span>
                )}
                {parsedPreview.beds && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    <Bed className="w-3 h-3" /> {parsedPreview.beds} bed{parsedPreview.beds > 1 ? 's' : ''}
                  </span>
                )}
                {parsedPreview.propertyType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                    <Home className="w-3 h-3" /> {parsedPreview.propertyType}
                  </span>
                )}
                {parsedPreview.petFriendly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                    <PawPrint className="w-3 h-3" /> Pet friendly
                  </span>
                )}
                {parsedPreview.duration && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" /> {parsedPreview.duration}
                  </span>
                )}
                {parsedPreview.amenities.map(a => (
                  <span key={a} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                    <Zap className="w-3 h-3" /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suggestions</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.value}`}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition ${
                    index === selectedIndex
                      ? 'bg-teal-50 dark:bg-teal-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    if (suggestion.type === 'city') {
                      setQuery(suggestion.value);
                      executeSearch(suggestion.value);
                    } else {
                      setQuery(suggestion.value);
                      executeSearch(suggestion.value);
                    }
                  }}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span className="text-sm text-gray-900 dark:text-gray-100">{suggestion.label}</span>
                  <span className="ml-auto text-xs text-gray-400 capitalize">{suggestion.type}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {suggestions.length === 0 && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Searches</p>
                <button
                  onClick={() => { clearRecentSearches(); setRecentSearches([]); }}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition ${
                    index === selectedIndex
                      ? 'bg-teal-50 dark:bg-teal-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setQuery(search);
                    executeSearch(search);
                  }}
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tip */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <Sparkles className="w-3 h-3 inline mr-1 text-teal-400" />
              Try: &quot;2 bed apartment in Boston under $2000&quot; or &quot;pet friendly studio near NYU&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
