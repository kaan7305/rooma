import { create } from 'zustand';
import type { Property } from '@/data/properties';
import apiClient from '@/lib/api-client';

export interface WishlistItem {
  property: Property;
  note?: string;
  addedAt: string;
}

export interface WishlistCollection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  items: WishlistItem[];
  isPublic: boolean;
  shareLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface WishlistState {
  collections: WishlistCollection[];
  loadCollections: () => Promise<void>;
  createCollection: (name: string, description?: string) => void;
  updateCollection: (id: string, data: Partial<WishlistCollection>) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, property: Property, note?: string) => void;
  removeFromCollection: (collectionId: string, propertyId: number) => void;
  updateItemNote: (collectionId: string, propertyId: number, note: string) => void;
  togglePublic: (collectionId: string) => void;
  generateShareLink: (collectionId: string) => string;
}


export const useWishlistStore = create<WishlistState>((set, get) => ({
  collections: [],

  loadCollections: async () => {
    try {
      // Try API first
      const response = await apiClient.get('/wishlists');
      const apiCollections: WishlistCollection[] = (response.data?.data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        coverImage: c.cover_image_url,
        items: (c.items || []).map((item: any) => ({
          property: item.property,
          note: item.note,
          addedAt: item.created_at,
        })),
        isPublic: c.is_public || false,
        shareLink: c.share_link,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));

      if (apiCollections.length > 0) {
        set({ collections: apiCollections });
        return;
      }
    } catch {
      // API not available — fall back to localStorage
    }

    // Fallback: load from localStorage
    const saved = typeof window !== 'undefined' ? localStorage.getItem('wishlistCollections') : null;
    if (saved) {
      try {
        set({ collections: JSON.parse(saved) });
      } catch {
        set({ collections: [] });
      }
    }
  },

  createCollection: (name: string, description?: string) => {
    const newCollection: WishlistCollection = {
      id: `col-${Date.now()}`,
      name,
      description,
      items: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...get().collections, newCollection];
    set({ collections: updated });
    localStorage.setItem('wishlistCollections', JSON.stringify(updated));
  },

  updateCollection: (id: string, data: Partial<WishlistCollection>) => {
    const updated = get().collections.map(col =>
      col.id === id
        ? { ...col, ...data, updatedAt: new Date().toISOString() }
        : col
    );
    set({ collections: updated });
    localStorage.setItem('wishlistCollections', JSON.stringify(updated));
  },

  deleteCollection: (id: string) => {
    const updated = get().collections.filter(col => col.id !== id);
    set({ collections: updated });
    localStorage.setItem('wishlistCollections', JSON.stringify(updated));
  },

  addToCollection: (collectionId: string, property: Property, note?: string) => {
    const updated = get().collections.map(col => {
      if (col.id === collectionId) {
        // Check if property already exists
        const exists = col.items.some(item => item.property.id === property.id);
        if (exists) return col;

        const newItem: WishlistItem = {
          property,
          note,
          addedAt: new Date().toISOString(),
        };

        return {
          ...col,
          items: [...col.items, newItem],
          updatedAt: new Date().toISOString(),
          // Set cover image to first property if not set
          coverImage: col.coverImage || property.images?.[0] || property.image,
        };
      }
      return col;
    });

    set({ collections: updated });
    localStorage.setItem('wishlistCollections', JSON.stringify(updated));
  },

  removeFromCollection: (collectionId: string, propertyId: number) => {
    const updated = get().collections.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          items: col.items.filter(item => item.property.id !== propertyId),
          updatedAt: new Date().toISOString(),
        };
      }
      return col;
    });

    set({ collections: updated });
    localStorage.setItem('wishlistCollections', JSON.stringify(updated));
  },

  updateItemNote: (collectionId: string, propertyId: number, note: string) => {
    const updated = get().collections.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          items: col.items.map(item =>
            item.property.id === propertyId
              ? { ...item, note }
              : item
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return col;
    });

    set({ collections: updated });
    localStorage.setItem('wishlistCollections', JSON.stringify(updated));
  },

  togglePublic: (collectionId: string) => {
    const updated = get().collections.map(col => {
      if (col.id === collectionId) {
        const isPublic = !col.isPublic;
        const shareLink = isPublic
          ? `https://sublet.com/shared/${col.name.toLowerCase().replace(/\s+/g, '-')}-${collectionId}`
          : undefined;

        return {
          ...col,
          isPublic,
          shareLink,
          updatedAt: new Date().toISOString(),
        };
      }
      return col;
    });

    set({ collections: updated });
    localStorage.setItem('wishlistCollections', JSON.stringify(updated));
  },

  generateShareLink: (collectionId: string) => {
    const collection = get().collections.find(col => col.id === collectionId);
    if (!collection) return '';

    if (collection.shareLink) {
      return collection.shareLink;
    }

    const shareLink = `https://sublet.com/shared/${collection.name.toLowerCase().replace(/\s+/g, '-')}-${collectionId}`;
    get().updateCollection(collectionId, { shareLink, isPublic: true });
    return shareLink;
  },
}));
