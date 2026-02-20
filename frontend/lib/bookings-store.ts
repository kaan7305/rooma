import { create } from 'zustand';
import { Property } from '@/data/properties';

export interface Booking {
  id: string;
  propertyId: number;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface BookingsState {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  cancelBooking: (bookingId: string) => void;
  getBooking: (bookingId: string) => Booking | undefined;
  loadBookings: () => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],

  addBooking: (bookingData) => {
    const { bookings } = get();
    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updatedBookings = [...bookings, newBooking];
    set({ bookings: updatedBookings });
    localStorage.setItem('rooma_bookings', JSON.stringify(updatedBookings));
  },

  cancelBooking: (bookingId: string) => {
    const { bookings } = get();
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: 'cancelled' as const }
        : booking
    );
    set({ bookings: updatedBookings });
    localStorage.setItem('rooma_bookings', JSON.stringify(updatedBookings));
  },

  getBooking: (bookingId: string) => {
    const { bookings } = get();
    return bookings.find(booking => booking.id === bookingId);
  },

  loadBookings: () => {
    try {
      const stored = localStorage.getItem('rooma_bookings');
      if (stored) {
        set({ bookings: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load bookings', error);
      set({ bookings: [] });
    }
  },
}));
