/**
 * Supabase Helper Types
 * Type-safe helpers for Supabase queries
 */

import type { Database } from './database.types';
import type { PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';

// Helper types for table rows
export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type PropertyRow = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export type PropertyPhotoRow = Database['public']['Tables']['property_photos']['Row'];
export type PropertyPhotoInsert = Database['public']['Tables']['property_photos']['Insert'];
export type PropertyPhotoUpdate = Database['public']['Tables']['property_photos']['Update'];

export type UniversityRow = Database['public']['Tables']['universities']['Row'];
export type UniversityInsert = Database['public']['Tables']['universities']['Insert'];
export type UniversityUpdate = Database['public']['Tables']['universities']['Update'];

export type WishlistRow = Database['public']['Tables']['wishlists']['Row'];
export type WishlistInsert = Database['public']['Tables']['wishlists']['Insert'];
export type WishlistUpdate = Database['public']['Tables']['wishlists']['Update'];

export type ConversationRow = Database['public']['Tables']['conversations']['Row'];
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
export type ConversationUpdate = Database['public']['Tables']['conversations']['Update'];

export type MessageRow = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type WishlistItemRow = Database['public']['Tables']['wishlist_items']['Row'];
export type WishlistItemInsert = Database['public']['Tables']['wishlist_items']['Insert'];
export type WishlistItemUpdate = Database['public']['Tables']['wishlist_items']['Update'];

export type StudentVerificationRow = Database['public']['Tables']['student_verifications']['Row'];
export type StudentVerificationInsert = Database['public']['Tables']['student_verifications']['Insert'];
export type StudentVerificationUpdate = Database['public']['Tables']['student_verifications']['Update'];

export type IdentityVerificationRow = Database['public']['Tables']['identity_verifications']['Row'];
export type IdentityVerificationInsert = Database['public']['Tables']['identity_verifications']['Insert'];
export type IdentityVerificationUpdate = Database['public']['Tables']['identity_verifications']['Update'];

export type UserSettingsRow = Database['public']['Tables']['user_settings']['Row'];
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update'];

export type ReviewPhotoRow = Database['public']['Tables']['review_photos']['Row'];
export type ReviewPhotoInsert = Database['public']['Tables']['review_photos']['Insert'];
export type ReviewPhotoUpdate = Database['public']['Tables']['review_photos']['Update'];

export type PropertyAmenityRow = Database['public']['Tables']['property_amenities']['Row'];
export type PropertyAmenityInsert = Database['public']['Tables']['property_amenities']['Insert'];

export type PropertyUniversityRow = Database['public']['Tables']['property_universities']['Row'];
export type PropertyUniversityInsert = Database['public']['Tables']['property_universities']['Insert'];

export type PayoutRow = Database['public']['Tables']['payouts']['Row'];
export type PayoutInsert = Database['public']['Tables']['payouts']['Insert'];
export type PayoutUpdate = Database['public']['Tables']['payouts']['Update'];

// Helper type for single query responses
export type SupabaseSingleResponse<T> = PostgrestSingleResponse<T>;
export type SupabaseResponse<T> = PostgrestResponse<T>;

