import { create } from 'zustand';
import { type Property } from '@/data/properties';

export interface Listing {
  id: number;
  userId: string;
  title: string;
  location: string;
  city: string;
  price: number;
  duration: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  amenities: string[];
  image: string;
  images?: string[];
  available: string;
  rating: number;
  createdAt: string;
}

interface ListingsState {
  listings: Listing[];
  loadListings: () => void;
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'rating'>) => void;
  updateListing: (id: number, data: Partial<Listing>) => void;
  deleteListing: (id: number) => void;
  getUserListings: (userId: string) => Listing[];
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],

  loadListings: () => {
    const listingsJson = localStorage.getItem('rooma_listings');
    if (listingsJson) {
      try {
        const listings = JSON.parse(listingsJson);
        set({ listings });
      } catch (error) {
        console.error('Failed to load listings', error);
        set({ listings: [] });
      }
    }
  },

  addListing: (listingData) => {
    const { listings } = get();
    const newListing: Listing = {
      ...listingData,
      id: Date.now(),
      rating: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedListings = [...listings, newListing];
    set({ listings: updatedListings });
    localStorage.setItem('rooma_listings', JSON.stringify(updatedListings));
  },

  updateListing: (id, data) => {
    const { listings } = get();
    const updatedListings = listings.map(listing =>
      listing.id === id ? { ...listing, ...data } : listing
    );
    set({ listings: updatedListings });
    localStorage.setItem('rooma_listings', JSON.stringify(updatedListings));
  },

  deleteListing: (id) => {
    const { listings } = get();
    const updatedListings = listings.filter(listing => listing.id !== id);
    set({ listings: updatedListings });
    localStorage.setItem('rooma_listings', JSON.stringify(updatedListings));
  },

  getUserListings: (userId) => {
    const { listings } = get();
    return listings.filter(listing => listing.userId === userId);
  },
}));
