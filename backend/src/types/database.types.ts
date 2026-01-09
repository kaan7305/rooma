/**
 * Supabase Database Types
 * Generated from Prisma schema for type-safe Supabase queries
 */

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
      property_photos: {
        Row: {
          id: string
          property_id: string
          photo_url: string
          caption: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          photo_url: string
          caption?: string | null
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          photo_url?: string
          caption?: string | null
          display_order?: number
          created_at?: string
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
      reviews: {
        Row: {
          id: string
          booking_id: string
          property_id: string
          reviewer_id: string | null
          reviewee_id: string | null
          review_type: string
          overall_rating: number
          cleanliness_rating: number | null
          accuracy_rating: number | null
          location_rating: number | null
          communication_rating: number | null
          value_rating: number | null
          review_text: string | null
          status: string
          host_response: string | null
          host_responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          property_id: string
          reviewer_id?: string | null
          reviewee_id?: string | null
          review_type: string
          overall_rating: number
          cleanliness_rating?: number | null
          accuracy_rating?: number | null
          location_rating?: number | null
          communication_rating?: number | null
          value_rating?: number | null
          review_text?: string | null
          status?: string
          host_response?: string | null
          host_responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          property_id?: string
          reviewer_id?: string | null
          reviewee_id?: string | null
          review_type?: string
          overall_rating?: number
          cleanliness_rating?: number | null
          accuracy_rating?: number | null
          location_rating?: number | null
          communication_rating?: number | null
          value_rating?: number | null
          review_text?: string | null
          status?: string
          host_response?: string | null
          host_responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      universities: {
        Row: {
          id: string
          name: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          city: string
          country: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      wishlist_items: {
        Row: {
          wishlist_id: string
          property_id: string
          added_at: string
        }
        Insert: {
          wishlist_id: string
          property_id: string
          added_at?: string
        }
        Update: {
          wishlist_id?: string
          property_id?: string
          added_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          property_id: string | null
          booking_id: string | null
          participant_1_id: string | null
          participant_2_id: string | null
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          booking_id?: string | null
          participant_1_id?: string | null
          participant_2_id?: string | null
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          booking_id?: string | null
          participant_1_id?: string | null
          participant_2_id?: string | null
          last_message_at?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string | null
          recipient_id: string | null
          message_text: string
          translated_text: Json | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id?: string | null
          recipient_id?: string | null
          message_text: string
          translated_text?: Json | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string | null
          recipient_id?: string | null
          message_text?: string
          translated_text?: Json | null
          read_at?: string | null
          created_at?: string
        }
      }
      amenities: {
        Row: {
          id: string
          name: string
          category: string | null
          icon_name: string | null
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          icon_name?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          icon_name?: string | null
        }
      }
      property_amenities: {
        Row: {
          property_id: string
          amenity_id: string
        }
        Insert: {
          property_id: string
          amenity_id: string
        }
        Update: {
          property_id?: string
          amenity_id?: string
        }
      }
      property_universities: {
        Row: {
          property_id: string
          university_id: string
          distance_km: number | null
          transit_minutes: number | null
        }
        Insert: {
          property_id: string
          university_id: string
          distance_km?: number | null
          transit_minutes?: number | null
        }
        Update: {
          property_id?: string
          university_id?: string
          distance_km?: number | null
          transit_minutes?: number | null
        }
      }
      review_photos: {
        Row: {
          id: string
          review_id: string
          photo_url: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          photo_url: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          photo_url?: string
          created_at?: string
        }
      }
      student_verifications: {
        Row: {
          id: string
          user_id: string
          university_name: string | null
          university_email: string | null
          student_id_photo_url: string | null
          verification_status: string
          verified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          university_name?: string | null
          university_email?: string | null
          student_id_photo_url?: string | null
          verification_status?: string
          verified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          university_name?: string | null
          university_email?: string | null
          student_id_photo_url?: string | null
          verification_status?: string
          verified_at?: string | null
          created_at?: string
        }
      }
      identity_verifications: {
        Row: {
          id: string
          user_id: string
          id_type: string | null
          id_number_hash: string | null
          id_front_photo_url: string | null
          id_back_photo_url: string | null
          verification_status: string
          verified_at: string | null
          provider: string | null
          provider_verification_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          id_type?: string | null
          id_number_hash?: string | null
          id_front_photo_url?: string | null
          id_back_photo_url?: string | null
          verification_status?: string
          verified_at?: string | null
          provider?: string | null
          provider_verification_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          id_type?: string | null
          id_number_hash?: string | null
          id_front_photo_url?: string | null
          id_back_photo_url?: string | null
          verification_status?: string
          verified_at?: string | null
          provider?: string | null
          provider_verification_id?: string | null
          created_at?: string
        }
      }
      payouts: {
        Row: {
          id: string
          host_id: string | null
          booking_id: string | null
          amount_cents: number
          platform_fee_cents: number
          net_amount_cents: number
          payout_status: string
          payout_method_id: string | null
          stripe_transfer_id: string | null
          scheduled_for: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          host_id?: string | null
          booking_id?: string | null
          amount_cents: number
          platform_fee_cents: number
          net_amount_cents: number
          payout_status?: string
          payout_method_id?: string | null
          stripe_transfer_id?: string | null
          scheduled_for?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          host_id?: string | null
          booking_id?: string | null
          amount_cents?: number
          platform_fee_cents?: number
          net_amount_cents?: number
          payout_status?: string
          payout_method_id?: string | null
          stripe_transfer_id?: string | null
          scheduled_for?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          language: string
          currency: string
          timezone: string
          email_notifications: boolean
          sms_notifications: boolean
          push_notifications: boolean
          marketing_emails: boolean
          booking_updates: boolean
          message_notifications: boolean
          profile_visibility: string
          show_email: boolean
          show_phone: boolean
          activity_status: boolean
          two_factor_enabled: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          language?: string
          currency?: string
          timezone?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          booking_updates?: boolean
          message_notifications?: boolean
          profile_visibility?: string
          show_email?: boolean
          show_phone?: boolean
          activity_status?: boolean
          two_factor_enabled?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          language?: string
          currency?: string
          timezone?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          booking_updates?: boolean
          message_notifications?: boolean
          profile_visibility?: string
          show_email?: boolean
          show_phone?: boolean
          activity_status?: boolean
          two_factor_enabled?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

