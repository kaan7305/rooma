import apiClient from './api-client';
import { AuthResponse, LoginCredentials, RegisterData } from '@/types';
import Cookies from 'js-cookie';

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    // Store tokens in cookies
    if (response.data.data.accessToken) {
      Cookies.set('accessToken', response.data.data.accessToken, { expires: 7 });
      Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 30 });
    }

    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    // Store tokens in cookies
    if (response.data.data.accessToken) {
      Cookies.set('accessToken', response.data.data.accessToken, { expires: 7 });
      Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 30 });
    }

    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};
