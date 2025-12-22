import apiClient from './api-client';
import { ApiResponse, Review, CreateReviewData } from '@/types';

export const reviewsApi = {
  // Get reviews for a property
  getPropertyReviews: async (propertyId: string): Promise<ApiResponse<Review[]>> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(
      `/reviews/property/${propertyId}`
    );
    return response.data;
  },

  // Get reviews by user
  getUserReviews: async (userId: string): Promise<ApiResponse<Review[]>> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
    return response.data;
  },

  // Create review
  createReview: async (data: CreateReviewData): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },

  // Update review
  updateReview: async (id: string, data: Partial<CreateReviewData>): Promise<ApiResponse<Review>> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/reviews/${id}`);
    return response.data;
  },
};
