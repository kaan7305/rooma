'use client';

import { useState, useEffect } from 'react';
import { Bookmark, X, Bell, BellOff, Trash2, Search } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useSavedSearchesStore, type SavedSearch } from '@/lib/saved-searches-store';
import { useToast } from '@/lib/toast-context';

interface SavedSearchesProps {
  currentSearch?: {
    location?: string;
    duration?: string;
    priceRange?: [number, number];
    beds?: number | null;
    baths?: number | null;
    amenities?: string[];
    propertyType?: string;
    moveInDate?: string;
    moveOutDate?: string;
  };
  onApplySearch?: (search: SavedSearch) => void;
}

export default function SavedSearches({ currentSearch, onApplySearch }: SavedSearchesProps) {
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const { searches, loadSearches, saveSearch, deleteSearch, updateSearch, getUserSearches, markSearchUsed } = useSavedSearchesStore();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [userSearches, setUserSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    loadSearches();
  }, [loadSearches]);

  useEffect(() => {
    if (user) {
      setUserSearches(getUserSearches(user.id));
    }
  }, [user, searches, getUserSearches]);

  const handleSaveSearch = () => {
    if (!isAuthenticated || !user) {
      toast.warning('Please log in to save searches');
      return;
    }

    if (!searchName.trim()) {
      toast.warning('Please enter a name for this search');
      return;
    }

    if (!currentSearch) {
      toast.warning('No search criteria to save');
      return;
    }

    saveSearch({
      userId: user.id,
      name: searchName.trim(),
      searchParams: currentSearch,
      alertsEnabled,
    });

    setSearchName('');
    setAlertsEnabled(false);
    setShowSaveDialog(false);
    toast.success('Search saved successfully!');
  };

  const handleApplySearch = (search: SavedSearch) => {
    markSearchUsed(search.id);
    onApplySearch?.(search);
    toast.success(`Applied search: ${search.name}`);
  };

  const handleDeleteSearch = (id: string, name: string) => {
    deleteSearch(id);
    toast.success(`Deleted search: ${name}`);
  };

  const handleToggleAlerts = (id: string, currentStatus: boolean) => {
    updateSearch(id, { alertsEnabled: !currentStatus });
    toast.success(currentStatus ? 'Alerts disabled' : 'Alerts enabled');
  };

  const formatSearchDescription = (searchParams: SavedSearch['searchParams']): string => {
    const parts: string[] = [];

    if (searchParams.location) parts.push(searchParams.location);
    if (searchParams.duration) parts.push(searchParams.duration);
    if (searchParams.priceRange) {
      parts.push(`$${searchParams.priceRange[0]}-$${searchParams.priceRange[1]}`);
    }
    if (searchParams.beds !== null && searchParams.beds !== undefined) {
      parts.push(`${searchParams.beds}+ beds`);
    }
    if (searchParams.baths !== null && searchParams.baths !== undefined) {
      parts.push(`${searchParams.baths}+ baths`);
    }
    if (searchParams.propertyType) {
      parts.push(searchParams.propertyType);
    }
    if (searchParams.amenities && searchParams.amenities.length > 0) {
      parts.push(`${searchParams.amenities.length} amenities`);
    }

    return parts.length > 0 ? parts.join(' · ') : 'No filters';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-rose-600" />
          <h2 className="text-xl font-bold text-gray-900">Saved Searches</h2>
        </div>
        {currentSearch && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg transition font-semibold text-sm flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            Save Current Search
          </button>
        )}
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="mb-6 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200">
          <h3 className="font-semibold text-gray-900 mb-3">Save This Search</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., 2BR in Boston"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="alerts-enabled"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
              />
              <label htmlFor="alerts-enabled" className="text-sm text-gray-700">
                Email me when new properties match this search
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveSearch}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg transition font-semibold text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSearchName('');
                  setAlertsEnabled(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Searches List */}
      {userSearches.length === 0 ? (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">No saved searches yet</p>
          <p className="text-gray-500 text-xs mt-1">Save your search to quickly find it later</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userSearches.map((search) => (
            <div
              key={search.id}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition cursor-pointer border border-gray-200"
              onClick={() => handleApplySearch(search)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{search.name}</h3>
                    {search.alertsEnabled && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full">
                        <Bell className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">Alerts On</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {formatSearchDescription(search.searchParams)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last used: {search.lastUsed ? formatDate(search.lastUsed) : formatDate(search.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAlerts(search.id, search.alertsEnabled || false);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                    title={search.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                  >
                    {search.alertsEnabled ? (
                      <BellOff className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Bell className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSearch(search.id, search.name);
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg transition"
                    title="Delete search"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
