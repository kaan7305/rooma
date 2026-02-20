import { create } from 'zustand';

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  searchParams: {
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
  createdAt: string;
  lastUsed?: string;
  alertsEnabled?: boolean; // For future feature: email alerts when new matching properties are listed
}

interface SavedSearchesState {
  searches: SavedSearch[];
  loadSearches: () => void;
  saveSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void;
  deleteSearch: (id: string) => void;
  updateSearch: (id: string, data: Partial<SavedSearch>) => void;
  getUserSearches: (userId: string) => SavedSearch[];
  markSearchUsed: (id: string) => void;
}

export const useSavedSearchesStore = create<SavedSearchesState>((set, get) => ({
  searches: [],

  loadSearches: () => {
    const searchesJson = localStorage.getItem('rooma_saved_searches');
    if (searchesJson) {
      try {
        const searches = JSON.parse(searchesJson);
        set({ searches });
      } catch (error) {
        console.error('Failed to load saved searches', error);
        set({ searches: [] });
      }
    }
  },

  saveSearch: (searchData) => {
    const { searches } = get();
    const newSearch: SavedSearch = {
      ...searchData,
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const updatedSearches = [...searches, newSearch];
    set({ searches: updatedSearches });
    localStorage.setItem('rooma_saved_searches', JSON.stringify(updatedSearches));
  },

  deleteSearch: (id) => {
    const { searches } = get();
    const updatedSearches = searches.filter(search => search.id !== id);
    set({ searches: updatedSearches });
    localStorage.setItem('rooma_saved_searches', JSON.stringify(updatedSearches));
  },

  updateSearch: (id, data) => {
    const { searches } = get();
    const updatedSearches = searches.map(search =>
      search.id === id ? { ...search, ...data } : search
    );
    set({ searches: updatedSearches });
    localStorage.setItem('rooma_saved_searches', JSON.stringify(updatedSearches));
  },

  getUserSearches: (userId) => {
    const { searches } = get();
    return searches
      .filter(search => search.userId === userId)
      .sort((a, b) => new Date(b.lastUsed || b.createdAt).getTime() - new Date(a.lastUsed || a.createdAt).getTime());
  },

  markSearchUsed: (id) => {
    const { searches } = get();
    const updatedSearches = searches.map(search =>
      search.id === id ? { ...search, lastUsed: new Date().toISOString() } : search
    );
    set({ searches: updatedSearches });
    localStorage.setItem('rooma_saved_searches', JSON.stringify(updatedSearches));
  },
}));
