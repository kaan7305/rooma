"use strict";
// Constants based on the ROOMA proposal
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION = exports.FILE_UPLOAD = exports.RATE_LIMIT = exports.JWT_REFRESH_TOKEN_EXPIRES = exports.JWT_ACCESS_TOKEN_EXPIRES = exports.MAX_STAY_MONTHS = exports.MIN_STAY_WEEKS = exports.PRICING = exports.CLAIM_STATUS = exports.PAYOUT_STATUS = exports.CALENDAR_STATUS = exports.REVIEW_TYPES = exports.REVIEW_STATUS = exports.VERIFICATION_STATUS = exports.CANCELLATION_POLICIES = exports.PAYMENT_STATUS = exports.BOOKING_STATUS = exports.PROPERTY_STATUS = exports.PROPERTY_TYPES = exports.USER_TYPES = void 0;
// User Types
exports.USER_TYPES = {
    GUEST: 'guest',
    HOST: 'host',
    BOTH: 'both',
};
// Property Types
exports.PROPERTY_TYPES = {
    ENTIRE_PLACE: 'entire_place',
    PRIVATE_ROOM: 'private_room',
    SHARED_ROOM: 'shared_room',
};
// Property Status
exports.PROPERTY_STATUS = {
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
};
// Booking Status
exports.BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
};
// Payment Status
exports.PAYMENT_STATUS = {
    PENDING: 'pending',
    PARTIAL: 'partial',
    COMPLETED: 'completed',
    REFUNDED: 'refunded',
};
// Cancellation Policies
exports.CANCELLATION_POLICIES = {
    FLEXIBLE: 'flexible',
    MODERATE: 'moderate',
    STRICT: 'strict',
};
// Verification Status
exports.VERIFICATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};
// Review Status
exports.REVIEW_STATUS = {
    PUBLISHED: 'published',
    HIDDEN: 'hidden',
    FLAGGED: 'flagged',
};
// Review Types
exports.REVIEW_TYPES = {
    GUEST_TO_HOST: 'guest_to_host',
    HOST_TO_GUEST: 'host_to_guest',
};
// Calendar Status
exports.CALENDAR_STATUS = {
    AVAILABLE: 'available',
    BOOKED: 'booked',
    BLOCKED: 'blocked',
};
// Payout Status
exports.PAYOUT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
};
// Claim Status
exports.CLAIM_STATUS = {
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    DENIED: 'denied',
    PAID: 'paid',
};
// Pricing
exports.PRICING = {
    GUEST_SERVICE_FEE_PERCENT: 8,
    HOST_COMMISSION_PERCENT: 4,
    TOTAL_PLATFORM_FEE_PERCENT: 12,
    PLUS_SUBSCRIPTION_MONTHLY: 999, // cents (€9.99)
    PLUS_SUBSCRIPTION_YEARLY: 9900, // cents (€99.00)
    PRO_SUBSCRIPTION_MONTHLY: 1999, // cents (€19.99)
    PRO_SUBSCRIPTION_YEARLY: 19900, // cents (€199.00)
    PLUS_DISCOUNT_PERCENT: 5,
    PRO_HOST_FEE_PERCENT: 3,
};
// Minimum Stay
exports.MIN_STAY_WEEKS = 2;
exports.MAX_STAY_MONTHS = 12;
// JWT
exports.JWT_ACCESS_TOKEN_EXPIRES = '15m';
exports.JWT_REFRESH_TOKEN_EXPIRES = '7d';
// Rate Limiting
exports.RATE_LIMIT = {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS_PER_IP: 100,
    MAX_REQUESTS_PER_USER: 500,
};
// File Upload
exports.FILE_UPLOAD = {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    MIN_PROPERTY_PHOTOS: 5,
};
// Pagination
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
