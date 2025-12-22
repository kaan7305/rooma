import { z } from 'zod';
import { PROPERTY_TYPES, PROPERTY_STATUS, MIN_STAY_WEEKS } from '../utils/constants';

/**
 * POST /api/properties
 * Create new property listing
 */
export const createPropertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long').trim(),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000).trim(),
  property_type: z.enum(
    [
      PROPERTY_TYPES.ENTIRE_PLACE,
      PROPERTY_TYPES.PRIVATE_ROOM,
      PROPERTY_TYPES.SHARED_ROOM,
    ] as const,
    { message: 'Invalid property type' }
  ),
  address_line1: z.string().min(1, 'Address is required').max(255).trim(),
  address_line2: z.string().max(255).trim().optional(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  state_province: z.string().max(100).trim().optional(),
  postal_code: z.string().min(1, 'Postal code is required').max(20).trim(),
  country: z.string().min(2, 'Country is required').max(100).trim(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  square_meters: z.number().int().min(1).max(10000).optional(),
  max_guests: z.number().int().min(1).max(50),
  monthly_price_cents: z.number().int().min(1000, 'Minimum price is $10/month'), // $10 minimum
  cleaning_fee_cents: z.number().int().min(0).optional(),
  security_deposit_cents: z.number().int().min(0).optional(),
  minimum_stay_weeks: z
    .number()
    .int()
    .min(MIN_STAY_WEEKS, `Minimum stay must be at least ${MIN_STAY_WEEKS} weeks`)
    .max(52),
  amenity_ids: z.array(z.string().uuid()).min(1, 'At least one amenity is required').optional(),
  university_id: z.string().uuid().optional(),
  distance_to_university_km: z.number().min(0).max(100).optional(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

/**
 * PATCH /api/properties/:id
 * Update existing property
 */
export const updatePropertySchema = z.object({
  title: z.string().min(10).max(200).trim().optional(),
  description: z.string().min(50).max(2000).trim().optional(),
  property_type: z
    .enum([
      PROPERTY_TYPES.ENTIRE_PLACE,
      PROPERTY_TYPES.PRIVATE_ROOM,
      PROPERTY_TYPES.SHARED_ROOM,
    ] as const)
    .optional(),
  address_line1: z.string().min(1).max(255).trim().optional(),
  address_line2: z.string().max(255).trim().optional(),
  city: z.string().min(1).max(100).trim().optional(),
  state_province: z.string().max(100).trim().optional(),
  postal_code: z.string().min(1).max(20).trim().optional(),
  country: z.string().min(2).max(100).trim().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().min(0).max(20).optional(),
  square_meters: z.number().int().min(1).max(10000).optional(),
  max_guests: z.number().int().min(1).max(50).optional(),
  monthly_price_cents: z.number().int().min(1000).optional(),
  cleaning_fee_cents: z.number().int().min(0).optional(),
  security_deposit_cents: z.number().int().min(0).optional(),
  minimum_stay_weeks: z.number().int().min(MIN_STAY_WEEKS).max(52).optional(),
  amenity_ids: z.array(z.string().uuid()).optional(),
  university_id: z.string().uuid().optional(),
  distance_to_university_km: z.number().min(0).max(100).optional(),
  status: z.enum([PROPERTY_STATUS.ACTIVE, PROPERTY_STATUS.INACTIVE, PROPERTY_STATUS.PENDING_REVIEW] as const).optional(),
});

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

/**
 * GET /api/properties (search)
 * Query parameters for property search
 */
export const searchPropertiesSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  university_id: z.string().uuid().optional(),
  min_price: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
  max_price: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
  bedrooms: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
  bathrooms: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
  property_type: z
    .enum([
      PROPERTY_TYPES.ENTIRE_PLACE,
      PROPERTY_TYPES.PRIVATE_ROOM,
      PROPERTY_TYPES.SHARED_ROOM,
    ] as const)
    .optional(),
  amenity_ids: z
    .string()
    .transform((val) => val.split(','))
    .pipe(z.array(z.string().uuid()))
    .optional(),
  check_in: z.string().date().optional(), // ISO date string YYYY-MM-DD
  check_out: z.string().date().optional(),
  max_distance_km: z.string().transform(Number).pipe(z.number().min(0).max(100)).optional(),
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
  sort_by: z.enum(['price_asc', 'price_desc', 'distance', 'created_at'] as const).default('created_at'),
});

export type SearchPropertiesInput = z.infer<typeof searchPropertiesSchema>;

/**
 * POST /api/properties/:id/photos
 * Add photo to property
 */
export const addPhotoSchema = z.object({
  photo_url: z.string().url('Invalid photo URL'),
  caption: z.string().max(255).trim().optional(),
  display_order: z.number().int().min(0).max(100).optional(),
});

export type AddPhotoInput = z.infer<typeof addPhotoSchema>;

/**
 * PATCH /api/properties/:id/availability
 * Update property availability calendar
 */
export const updateAvailabilitySchema = z.object({
  unavailable_dates: z.array(
    z.object({
      start_date: z.string().date(),
      end_date: z.string().date(),
      reason: z.enum(['booked', 'blocked', 'maintenance'] as const).optional(),
    })
  ),
});

export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
