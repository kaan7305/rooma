// User types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_photo_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bio?: string;
  languages?: string[];
  university_id?: string;
  is_student: boolean;
  is_host: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  university_id?: string;
  is_student?: boolean;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Property types
export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  price_per_month: number;
  bedrooms: number;
  bathrooms: number;
  max_occupants: number;
  square_feet?: number;
  amenities?: string[];
  house_rules?: string[];
  available_from: string;
  available_to: string;
  is_available: boolean;
  host_id: string;
  host?: User;
  photos?: PropertyPhoto[];
  created_at: string;
  updated_at: string;
}

export interface PropertyPhoto {
  id: string;
  property_id: string;
  photo_url: string;
  display_order: number;
  created_at: string;
}

export interface PropertySearchParams {
  city?: string;
  state?: string;
  country?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  available_from?: string;
  available_to?: string;
  page?: number;
  limit?: number;
}

// Booking types
export interface Booking {
  id: string;
  property_id: string;
  guest_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  property?: Property;
  guest?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  special_requests?: string;
}

// Review types
export interface Review {
  id: string;
  property_id: string;
  reviewer_id: string;
  booking_id: string;
  rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  value_rating?: number;
  comment?: string;
  reviewer?: User;
  property?: Property;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  property_id: string;
  booking_id: string;
  rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  value_rating?: number;
  comment?: string;
}

// Wishlist types
export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  items?: WishlistItem[];
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  property_id: string;
  property?: Property;
  added_at: string;
}

// Message types
export interface Conversation {
  id: string;
  property_id?: string;
  participant_ids: string[];
  participants?: User[];
  last_message?: Message;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  sender?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateConversationData {
  recipient_id: string;
  property_id?: string;
  initial_message: string;
}

// University types
export interface University {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
}

// Payment types
export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

// Payout types
export interface Payout {
  id: string;
  host_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stripe_payout_id?: string;
  created_at: string;
  updated_at: string;
}
