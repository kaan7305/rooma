// Auto-generated database types for Supabase client
// Based on Prisma schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string | null
          first_name: string
          last_name: string
          phone: string | null
          phone_verified: boolean
          email_verified: boolean
          date_of_birth: string | null
          profile_photo_url: string | null
          bio: string | null
          user_type: string
          student_verified: boolean
          id_verified: boolean
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash?: string | null
          first_name: string
          last_name: string
          phone?: string | null
          phone_verified?: boolean
          email_verified?: boolean
          date_of_birth?: string | null
          profile_photo_url?: string | null
          bio?: string | null
          user_type: string
          student_verified?: boolean
          id_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string | null
          first_name?: string
          last_name?: string
          phone?: string | null
          phone_verified?: boolean
          email_verified?: boolean
          date_of_birth?: string | null
          profile_photo_url?: string | null
          bio?: string | null
          user_type?: string
          student_verified?: boolean
          id_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      properties: {
        Row: {
          id: string
          host_id: string
          title: string
          description: string
          property_type: string
          address_line1: string
          address_line2: string | null
          city: string
          state_province: string | null
          postal_code: string | null
          country: string
          latitude: number | null
          longitude: number | null
          bedrooms: number
          beds: number
          bathrooms: number
          square_meters: number | null
          max_guests: number
          monthly_price_cents: number
          security_deposit_cents: number | null
          cleaning_fee_cents: number
          minimum_stay_weeks: number
          maximum_stay_months: number
          instant_book: boolean
          cancellation_policy: string
          status: string
          published_at: string | null
          nearest_university_id: string | null
          distance_to_university_km: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          description: string
          property_type: string
          address_line1: string
          address_line2?: string | null
          city: string
          state_province?: string | null
          postal_code?: string | null
          country: string
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number
          beds?: number
          bathrooms?: number
          square_meters?: number | null
          max_guests?: number
          monthly_price_cents: number
          security_deposit_cents?: number | null
          cleaning_fee_cents?: number
          minimum_stay_weeks?: number
          maximum_stay_months?: number
          instant_book?: boolean
          cancellation_policy?: string
          status?: string
          published_at?: string | null
          nearest_university_id?: string | null
          distance_to_university_km?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          description?: string
          property_type?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state_province?: string | null
          postal_code?: string | null
          country?: string
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number
          beds?: number
          bathrooms?: number
          square_meters?: number | null
          max_guests?: number
          monthly_price_cents?: number
          security_deposit_cents?: number | null
          cleaning_fee_cents?: number
          minimum_stay_weeks?: number
          maximum_stay_months?: number
          instant_book?: boolean
          cancellation_policy?: string
          status?: string
          published_at?: string | null
          nearest_university_id?: string | null
          distance_to_university_km?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string | null
          guest_id: string | null
          host_id: string | null
          check_in_date: string
          check_out_date: string
          nights: number
          subtotal_cents: number
          service_fee_cents: number
          cleaning_fee_cents: number
          security_deposit_cents: number | null
          total_cents: number
          payment_status: string
          payment_method: string | null
          stripe_payment_intent_id: string | null
          booking_status: string
          cancellation_reason: string | null
          cancelled_by: string | null
          cancelled_at: string | null
          guest_count: number
          purpose_of_stay: string | null
          special_requests: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          guest_id?: string | null
          host_id?: string | null
          check_in_date: string
          check_out_date: string
          nights: number
          subtotal_cents: number
          service_fee_cents: number
          cleaning_fee_cents?: number
          security_deposit_cents?: number | null
          total_cents: number
          payment_status?: string
          payment_method?: string | null
          stripe_payment_intent_id?: string | null
          booking_status?: string
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cancelled_at?: string | null
          guest_count?: number
          purpose_of_stay?: string | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          guest_id?: string | null
          host_id?: string | null
          check_in_date?: string
          check_out_date?: string
          nights?: number
          subtotal_cents?: number
          service_fee_cents?: number
          cleaning_fee_cents?: number
          security_deposit_cents?: number | null
          total_cents?: number
          payment_status?: string
          payment_method?: string | null
          stripe_payment_intent_id?: string | null
          booking_status?: string
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cancelled_at?: string | null
          guest_count?: number
          purpose_of_stay?: string | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
