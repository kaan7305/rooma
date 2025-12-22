import apiClient from './api-client';
import { ApiResponse, University } from '@/types';

export const universitiesApi = {
  // Get all universities
  getUniversities: async (): Promise<ApiResponse<University[]>> => {
    const response = await apiClient.get<ApiResponse<University[]>>('/universities');
    return response.data;
  },

  // Search universities
  searchUniversities: async (query: string): Promise<ApiResponse<University[]>> => {
    const response = await apiClient.get<ApiResponse<University[]>>('/universities/search', {
      params: { q: query },
    });
    return response.data;
  },
};
