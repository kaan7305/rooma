"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvailabilitySchema = exports.addPhotoSchema = exports.searchPropertiesSchema = exports.updatePropertySchema = exports.createPropertySchema = void 0;
var zod_1 = require("zod");
var constants_1 = require("../utils/constants");
/**
 * POST /api/properties
 * Create new property listing
 */
exports.createPropertySchema = zod_1.z.object({
    title: zod_1.z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long').trim(),
    description: zod_1.z.string().min(50, 'Description must be at least 50 characters').max(2000).trim(),
    property_type: zod_1.z.enum([
        constants_1.PROPERTY_TYPES.ENTIRE_PLACE,
        constants_1.PROPERTY_TYPES.PRIVATE_ROOM,
        constants_1.PROPERTY_TYPES.SHARED_ROOM,
    ], { message: 'Invalid property type' }),
    address_line1: zod_1.z.string().min(1, 'Address is required').max(255).trim(),
    address_line2: zod_1.z.string().max(255).trim().optional(),
    city: zod_1.z.string().min(1, 'City is required').max(100).trim(),
    state_province: zod_1.z.string().max(100).trim().optional(),
    postal_code: zod_1.z.string().min(1, 'Postal code is required').max(20).trim(),
    country: zod_1.z.string().min(2, 'Country is required').max(100).trim(),
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    bedrooms: zod_1.z.number().int().min(0).max(20),
    bathrooms: zod_1.z.number().min(0).max(20),
    square_meters: zod_1.z.number().int().min(1).max(10000).optional(),
    max_guests: zod_1.z.number().int().min(1).max(50),
    monthly_price_cents: zod_1.z.number().int().min(1000, 'Minimum price is $10/month'), // $10 minimum
    cleaning_fee_cents: zod_1.z.number().int().min(0).optional(),
    security_deposit_cents: zod_1.z.number().int().min(0).optional(),
    minimum_stay_weeks: zod_1.z
        .number()
        .int()
        .min(constants_1.MIN_STAY_WEEKS, "Minimum stay must be at least ".concat(constants_1.MIN_STAY_WEEKS, " weeks"))
        .max(52),
    amenity_ids: zod_1.z.array(zod_1.z.string().uuid()).min(1, 'At least one amenity is required').optional(),
    university_id: zod_1.z.string().uuid().optional(),
    distance_to_university_km: zod_1.z.number().min(0).max(100).optional(),
});
/**
 * PATCH /api/properties/:id
 * Update existing property
 */
exports.updatePropertySchema = zod_1.z.object({
    title: zod_1.z.string().min(10).max(200).trim().optional(),
    description: zod_1.z.string().min(50).max(2000).trim().optional(),
    property_type: zod_1.z
        .enum([
        constants_1.PROPERTY_TYPES.ENTIRE_PLACE,
        constants_1.PROPERTY_TYPES.PRIVATE_ROOM,
        constants_1.PROPERTY_TYPES.SHARED_ROOM,
    ])
        .optional(),
    address_line1: zod_1.z.string().min(1).max(255).trim().optional(),
    address_line2: zod_1.z.string().max(255).trim().optional(),
    city: zod_1.z.string().min(1).max(100).trim().optional(),
    state_province: zod_1.z.string().max(100).trim().optional(),
    postal_code: zod_1.z.string().min(1).max(20).trim().optional(),
    country: zod_1.z.string().min(2).max(100).trim().optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    bedrooms: zod_1.z.number().int().min(0).max(20).optional(),
    bathrooms: zod_1.z.number().min(0).max(20).optional(),
    square_meters: zod_1.z.number().int().min(1).max(10000).optional(),
    max_guests: zod_1.z.number().int().min(1).max(50).optional(),
    monthly_price_cents: zod_1.z.number().int().min(1000).optional(),
    cleaning_fee_cents: zod_1.z.number().int().min(0).optional(),
    security_deposit_cents: zod_1.z.number().int().min(0).optional(),
    minimum_stay_weeks: zod_1.z.number().int().min(constants_1.MIN_STAY_WEEKS).max(52).optional(),
    amenity_ids: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    university_id: zod_1.z.string().uuid().optional(),
    distance_to_university_km: zod_1.z.number().min(0).max(100).optional(),
    status: zod_1.z.enum([constants_1.PROPERTY_STATUS.ACTIVE, constants_1.PROPERTY_STATUS.INACTIVE, constants_1.PROPERTY_STATUS.PENDING_REVIEW]).optional(),
});
/**
 * GET /api/properties (search)
 * Query parameters for property search
 */
exports.searchPropertiesSchema = zod_1.z.object({
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    university_id: zod_1.z.string().uuid().optional(),
    min_price: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().min(0)).optional(),
    max_price: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().min(0)).optional(),
    bedrooms: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().min(0)).optional(),
    bathrooms: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().min(0)).optional(),
    property_type: zod_1.z
        .enum([
        constants_1.PROPERTY_TYPES.ENTIRE_PLACE,
        constants_1.PROPERTY_TYPES.PRIVATE_ROOM,
        constants_1.PROPERTY_TYPES.SHARED_ROOM,
    ])
        .optional(),
    amenity_ids: zod_1.z
        .string()
        .transform(function (val) { return val.split(','); })
        .pipe(zod_1.z.array(zod_1.z.string().uuid()))
        .optional(),
    check_in: zod_1.z.string().date().optional(), // ISO date string YYYY-MM-DD
    check_out: zod_1.z.string().date().optional(),
    max_distance_km: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0).max(100)).optional(),
    page: zod_1.z.string().optional().default('1').transform(Number).pipe(zod_1.z.number().int().min(1)),
    limit: zod_1.z.string().optional().default('20').transform(Number).pipe(zod_1.z.number().int().min(1).max(100)),
    sort_by: zod_1.z.enum(['price_asc', 'price_desc', 'distance', 'created_at']).default('created_at'),
});
/**
 * POST /api/properties/:id/photos
 * Add photo to property
 */
exports.addPhotoSchema = zod_1.z.object({
    photo_url: zod_1.z.string().url('Invalid photo URL'),
    caption: zod_1.z.string().max(255).trim().optional(),
    display_order: zod_1.z.number().int().min(0).max(100).optional(),
});
/**
 * PATCH /api/properties/:id/availability
 * Update property availability calendar
 */
exports.updateAvailabilitySchema = zod_1.z.object({
    unavailable_dates: zod_1.z.array(zod_1.z.object({
        start_date: zod_1.z.string().date(),
        end_date: zod_1.z.string().date(),
        reason: zod_1.z.enum(['booked', 'blocked', 'maintenance']).optional(),
    })),
});
