import apiClient from './api-client';
import { ApiResponse, User } from '@/types';

export const usersApi = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);
    return response.data;
  },

  // Upload profile photo
  uploadProfilePhoto: async (file: File): Promise<ApiResponse<{ url: string; user: User }>> => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post<ApiResponse<{ url: string; user: User }>>(
      '/upload/profile-photo',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/users/change-password', data);
    return response.data;
  },

  // Become a host
  becomeHost: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/users/become-host');
    return response.data;
  },
};
