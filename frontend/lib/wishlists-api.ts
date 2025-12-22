import apiClient from './api-client';
import { ApiResponse, Wishlist, WishlistItem } from '@/types';

export const wishlistsApi = {
  // Get all wishlists for current user
  getMyWishlists: async (): Promise<ApiResponse<Wishlist[]>> => {
    const response = await apiClient.get<ApiResponse<Wishlist[]>>('/wishlists');
    return response.data;
  },

  // Get single wishlist
  getWishlist: async (id: string): Promise<ApiResponse<Wishlist>> => {
    const response = await apiClient.get<ApiResponse<Wishlist>>(`/wishlists/${id}`);
    return response.data;
  },

  // Create wishlist
  createWishlist: async (data: {
    name: string;
    description?: string;
    is_public?: boolean;
  }): Promise<ApiResponse<Wishlist>> => {
    const response = await apiClient.post<ApiResponse<Wishlist>>('/wishlists', data);
    return response.data;
  },

  // Update wishlist
  updateWishlist: async (
    id: string,
    data: Partial<{ name: string; description?: string; is_public?: boolean }>
  ): Promise<ApiResponse<Wishlist>> => {
    const response = await apiClient.put<ApiResponse<Wishlist>>(`/wishlists/${id}`, data);
    return response.data;
  },

  // Delete wishlist
  deleteWishlist: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/wishlists/${id}`);
    return response.data;
  },

  // Add property to wishlist
  addToWishlist: async (
    wishlistId: string,
    propertyId: string
  ): Promise<ApiResponse<WishlistItem>> => {
    const response = await apiClient.post<ApiResponse<WishlistItem>>(
      `/wishlists/${wishlistId}/items`,
      { property_id: propertyId }
    );
    return response.data;
  },

  // Remove property from wishlist
  removeFromWishlist: async (wishlistId: string, itemId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/wishlists/${wishlistId}/items/${itemId}`
    );
    return response.data;
  },
};
