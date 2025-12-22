import { create } from 'zustand';

interface FavoritesState {
  favorites: number[]; // Array of property IDs
  guestRequestFavorites: string[]; // Array of guest request IDs
  roommateFavorites: string[]; // Array of roommate listing IDs
  addFavorite: (propertyId: number) => void;
  removeFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
  addGuestRequestFavorite: (requestId: string) => void;
  removeGuestRequestFavorite: (requestId: string) => void;
  isGuestRequestFavorite: (requestId: string) => boolean;
  addRoommateFavorite: (listingId: string) => void;
  removeRoommateFavorite: (listingId: string) => void;
  isRoommateFavorite: (listingId: string) => boolean;
  loadFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  guestRequestFavorites: [],
  roommateFavorites: [],

  addFavorite: (propertyId: number) => {
    const { favorites } = get();
    if (!favorites.includes(propertyId)) {
      const newFavorites = [...favorites, propertyId];
      set({ favorites: newFavorites });
      localStorage.setItem('nestquarter_favorites', JSON.stringify(newFavorites));
    }
  },

  removeFavorite: (propertyId: number) => {
    const { favorites } = get();
    const newFavorites = favorites.filter(id => id !== propertyId);
    set({ favorites: newFavorites });
    localStorage.setItem('nestquarter_favorites', JSON.stringify(newFavorites));
  },

  isFavorite: (propertyId: number) => {
    const { favorites } = get();
    return favorites.includes(propertyId);
  },

  addGuestRequestFavorite: (requestId: string) => {
    const { guestRequestFavorites } = get();
    if (!guestRequestFavorites.includes(requestId)) {
      const newFavorites = [...guestRequestFavorites, requestId];
      set({ guestRequestFavorites: newFavorites });
      localStorage.setItem('nestquarter_guest_request_favorites', JSON.stringify(newFavorites));
    }
  },

  removeGuestRequestFavorite: (requestId: string) => {
    const { guestRequestFavorites } = get();
    const newFavorites = guestRequestFavorites.filter(id => id !== requestId);
    set({ guestRequestFavorites: newFavorites });
    localStorage.setItem('nestquarter_guest_request_favorites', JSON.stringify(newFavorites));
  },

  isGuestRequestFavorite: (requestId: string) => {
    const { guestRequestFavorites } = get();
    return guestRequestFavorites.includes(requestId);
  },

  addRoommateFavorite: (listingId: string) => {
    const { roommateFavorites } = get();
    if (!roommateFavorites.includes(listingId)) {
      const newFavorites = [...roommateFavorites, listingId];
      set({ roommateFavorites: newFavorites });
      localStorage.setItem('nestquarter_roommate_favorites', JSON.stringify(newFavorites));
    }
  },

  removeRoommateFavorite: (listingId: string) => {
    const { roommateFavorites } = get();
    const newFavorites = roommateFavorites.filter(id => id !== listingId);
    set({ roommateFavorites: newFavorites });
    localStorage.setItem('nestquarter_roommate_favorites', JSON.stringify(newFavorites));
  },

  isRoommateFavorite: (listingId: string) => {
    const { roommateFavorites } = get();
    return roommateFavorites.includes(listingId);
  },

  loadFavorites: () => {
    try {
      const stored = localStorage.getItem('nestquarter_favorites');
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }

      const storedGuestRequests = localStorage.getItem('nestquarter_guest_request_favorites');
      if (storedGuestRequests) {
        set({ guestRequestFavorites: JSON.parse(storedGuestRequests) });
      }

      const storedRoommates = localStorage.getItem('nestquarter_roommate_favorites');
      if (storedRoommates) {
        set({ roommateFavorites: JSON.parse(storedRoommates) });
      }
    } catch (error) {
      console.error('Failed to load favorites', error);
      set({ favorites: [], guestRequestFavorites: [], roommateFavorites: [] });
    }
  },
}));
