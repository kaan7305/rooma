import apiClient from './api-client';
import { ApiResponse, Booking, CreateBookingData } from '@/types';

export const bookingsApi = {
  // Get all bookings for current user
  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/my-bookings');
    return response.data;
  },

  // Get single booking
  getBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (data: CreateBookingData): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (
    id: string,
    status: 'confirmed' | 'cancelled'
  ): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.delete<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  // Get bookings for a property (host only)
  getPropertyBookings: async (propertyId: string): Promise<ApiResponse<Booking[]>> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>(
      `/bookings/property/${propertyId}`
    );
    return response.data;
  },

  // Check availability
  checkAvailability: async (
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<ApiResponse<{ available: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
      `/bookings/check-availability`,
      {
        params: { property_id: propertyId, check_in: checkIn, check_out: checkOut },
      }
    );
    return response.data;
  },
};
