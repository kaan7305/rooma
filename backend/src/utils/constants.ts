// Constants based on the ROOMA proposal

// User Types
export const USER_TYPES = {
  GUEST: 'guest',
  HOST: 'host',
  BOTH: 'both',
} as const;

// Property Types
export const PROPERTY_TYPES = {
  ENTIRE_PLACE: 'entire_place',
  PRIVATE_ROOM: 'private_room',
  SHARED_ROOM: 'shared_room',
} as const;

// Property Status
export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
} as const;

// Cancellation Policies
export const CANCELLATION_POLICIES = {
  FLEXIBLE: 'flexible',
  MODERATE: 'moderate',
  STRICT: 'strict',
} as const;

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Review Status
export const REVIEW_STATUS = {
  PUBLISHED: 'published',
  HIDDEN: 'hidden',
  FLAGGED: 'flagged',
} as const;

// Review Types
export const REVIEW_TYPES = {
  GUEST_TO_HOST: 'guest_to_host',
  HOST_TO_GUEST: 'host_to_guest',
} as const;

// Calendar Status
export const CALENDAR_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  BLOCKED: 'blocked',
} as const;

// Payout Status
export const PAYOUT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Claim Status
export const CLAIM_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  DENIED: 'denied',
  PAID: 'paid',
} as const;

// Pricing
export const PRICING = {
  GUEST_SERVICE_FEE_PERCENT: 8,
  HOST_COMMISSION_PERCENT: 4,
  TOTAL_PLATFORM_FEE_PERCENT: 12,
  PLUS_SUBSCRIPTION_MONTHLY: 999, // cents (€9.99)
  PLUS_SUBSCRIPTION_YEARLY: 9900, // cents (€99.00)
  PRO_SUBSCRIPTION_MONTHLY: 1999, // cents (€19.99)
  PRO_SUBSCRIPTION_YEARLY: 19900, // cents (€199.00)
  PLUS_DISCOUNT_PERCENT: 5,
  PRO_HOST_FEE_PERCENT: 3,
} as const;

// Minimum Stay
export const MIN_STAY_WEEKS = 2;
export const MAX_STAY_MONTHS = 12;

// JWT
export const JWT_ACCESS_TOKEN_EXPIRES = '15m';
export const JWT_REFRESH_TOKEN_EXPIRES = '7d';

// Rate Limiting
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS_PER_IP: 100,
  MAX_REQUESTS_PER_USER: 500,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  MIN_PROPERTY_PHOTOS: 5,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];
export type PropertyType = typeof PROPERTY_TYPES[keyof typeof PROPERTY_TYPES];
export type PropertyStatus = typeof PROPERTY_STATUS[keyof typeof PROPERTY_STATUS];
export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type CancellationPolicy = typeof CANCELLATION_POLICIES[keyof typeof CANCELLATION_POLICIES];
export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
export type ReviewStatus = typeof REVIEW_STATUS[keyof typeof REVIEW_STATUS];
export type ReviewType = typeof REVIEW_TYPES[keyof typeof REVIEW_TYPES];
export type CalendarStatus = typeof CALENDAR_STATUS[keyof typeof CALENDAR_STATUS];
export type PayoutStatus = typeof PAYOUT_STATUS[keyof typeof PAYOUT_STATUS];
export type ClaimStatus = typeof CLAIM_STATUS[keyof typeof CLAIM_STATUS];
