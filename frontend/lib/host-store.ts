import { create } from 'zustand';
import { type Property } from '@/data/properties';
import apiClient from '@/lib/api-client';

export interface HostProperty extends Omit<Property, 'instantBook' | 'verified'> {
  status: 'active' | 'inactive' | 'pending';
  bookingsCount: number;
  revenue: number;
  views: number;
  averageRating: number;
  reviewsCount: number;
  instantBook?: boolean;
  verified?: boolean;
}

export interface BookingRequest {
  id: string;
  propertyId: number;
  propertyTitle: string;
  propertyImage: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestAvatar?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'declined' | 'cancelled';
  requestDate: string;
  message?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface HostState {
  properties: HostProperty[];
  bookingRequests: BookingRequest[];
  revenueData: RevenueData[];
  totalRevenue: number;
  totalBookings: number;
  activeListings: number;
  loadHostData: () => Promise<void>;
  addProperty: (property: Omit<HostProperty, 'id'>) => void;
  updateProperty: (id: number, updates: Partial<HostProperty>) => void;
  deleteProperty: (id: number) => void;
  updateBookingRequest: (id: string, status: 'approved' | 'declined') => void;
}

export const useHostStore = create<HostState>((set, get) => ({
  properties: [],
  bookingRequests: [],
  revenueData: [],
  totalRevenue: 0,
  totalBookings: 0,
  activeListings: 0,

  loadHostData: async () => {
    try {
      // Fetch host's properties from API
      const [propertiesRes, bookingsRes] = await Promise.all([
        apiClient.get('/properties/my-listings').catch(() => null),
        apiClient.get('/bookings/host-requests').catch(() => null),
      ]);

      const apiProperties: HostProperty[] = (propertiesRes?.data?.data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        location: `${p.city}, ${p.country}`,
        city: p.city,
        price: (p.monthly_price_cents || 0) / 100,
        rating: p.average_rating || 0,
        image: p.photos?.[0]?.photo_url || '',
        beds: p.bedrooms || 0,
        baths: p.bathrooms || 0,
        sqft: p.square_feet || 0,
        amenities: (p.amenities || []).map((a: any) => a.name || a.amenity_id),
        type: p.property_type || 'Apartment',
        duration: `${p.minimum_stay_months || 1} months min`,
        durationMonths: p.minimum_stay_months || 1,
        description: p.description || '',
        available: p.status === 'active' ? 'Available Now' : 'Unavailable',
        reviews: p.total_reviews || 0,
        instantBook: p.instant_book || false,
        verified: true,
        status: p.status || 'active',
        bookingsCount: p.bookings_count || 0,
        revenue: (p.total_revenue_cents || 0) / 100,
        views: p.view_count || 0,
        averageRating: p.average_rating || 0,
        reviewsCount: p.total_reviews || 0,
      }));

      const apiBookings: BookingRequest[] = (bookingsRes?.data?.data || []).map((b: any) => ({
        id: b.id,
        propertyId: b.property_id,
        propertyTitle: b.property?.title || '',
        propertyImage: b.property?.photos?.[0]?.photo_url || '',
        guestId: b.guest_id,
        guestName: `${b.guest?.first_name || ''} ${b.guest?.last_name || ''}`.trim(),
        guestEmail: b.guest?.email || '',
        guestAvatar: b.guest?.profile_photo_url,
        checkIn: b.check_in_date,
        checkOut: b.check_out_date,
        guests: b.guest_count || 1,
        totalPrice: (b.total_price_cents || 0) / 100,
        status: b.booking_status || 'pending',
        requestDate: b.created_at,
        message: b.guest_message,
      }));

      const properties = apiProperties.length > 0 ? apiProperties : get().properties;
      const bookingRequests = apiBookings.length > 0 ? apiBookings : get().bookingRequests;

      // Revenue data — use API data if available, otherwise calculate from properties
      const revenueData: RevenueData[] = get().revenueData;

      const totalRevenue = properties.reduce((sum, p) => sum + p.revenue, 0);
      const totalBookings = properties.reduce((sum, p) => sum + p.bookingsCount, 0);
      const activeListings = properties.filter(p => p.status === 'active').length;

      set({
        properties,
        bookingRequests,
        revenueData,
        totalRevenue,
        totalBookings,
        activeListings,
      });
    } catch (error) {
      console.error('Failed to load host data:', error);
    }
  },

  addProperty: (property) => {
    const newProperty: HostProperty = {
      ...property,
      id: Date.now(),
      bookingsCount: 0,
      revenue: 0,
      views: 0,
      averageRating: 0,
      reviewsCount: 0,
      status: 'pending',
    };
    set((state) => ({
      properties: [...state.properties, newProperty],
      activeListings: state.properties.filter(p => p.status === 'active').length + 1,
    }));
  },

  updateProperty: (id, updates) => {
    set((state) => ({
      properties: state.properties.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  deleteProperty: (id) => {
    set((state) => ({
      properties: state.properties.filter(p => p.id !== id),
      activeListings: state.properties.filter(p => p.id !== id && p.status === 'active').length,
    }));
  },

  updateBookingRequest: (id, status) => {
    set((state) => ({
      bookingRequests: state.bookingRequests.map(req =>
        req.id === id ? { ...req, status } : req
      ),
    }));
  },
}));
