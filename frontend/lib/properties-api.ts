import apiClient from './api-client';
import { ApiResponse, Property, PropertySearchParams } from '@/types';

export const propertiesApi = {
  // Get all properties with optional filters
  getProperties: async (params?: PropertySearchParams): Promise<ApiResponse<Property[]>> => {
    const response = await apiClient.get<ApiResponse<Property[]>>('/properties', { params });
    return response.data;
  },

  // Get single property by ID
  getProperty: async (id: string): Promise<ApiResponse<Property>> => {
    const response = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data;
  },

  // Create new property (host only)
  createProperty: async (data: Partial<Property>): Promise<ApiResponse<Property>> => {
    const response = await apiClient.post<ApiResponse<Property>>('/properties', data);
    return response.data;
  },

  // Update property (host only)
  updateProperty: async (id: string, data: Partial<Property>): Promise<ApiResponse<Property>> => {
    const response = await apiClient.put<ApiResponse<Property>>(`/properties/${id}`, data);
    return response.data;
  },

  // Delete property (host only)
  deleteProperty: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/properties/${id}`);
    return response.data;
  },

  // Get properties by host
  getHostProperties: async (hostId: string): Promise<ApiResponse<Property[]>> => {
    const response = await apiClient.get<ApiResponse<Property[]>>(`/properties/host/${hostId}`);
    return response.data;
  },

  // Search properties
  searchProperties: async (query: string): Promise<ApiResponse<Property[]>> => {
    const response = await apiClient.get<ApiResponse<Property[]>>('/properties/search', {
      params: { q: query },
    });
    return response.data;
  },
};
