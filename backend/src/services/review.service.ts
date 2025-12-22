import prisma from '../config/database';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { BOOKING_STATUS, REVIEW_TYPES } from '../utils/constants';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  HostResponseInput,
  GetReviewsInput,
} from '../validators/review.validator';

/**
 * Create review for a completed booking
 */
export const createReview = async (userId: string, data: CreateReviewInput) => {
  const { booking_id, photo_urls, ...reviewData } = data;

  // Get booking details
  const booking = await prisma.booking.findUnique({
    where: { id: booking_id },
    select: {
      id: true,
      booking_status: true,
      guest_id: true,
      host_id: true,
      property_id: true,
      check_out_date: true,
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Only completed bookings can be reviewed
  if (booking.booking_status !== BOOKING_STATUS.COMPLETED) {
    throw new BadRequestError('Only completed bookings can be reviewed');
  }

  // Check if user is part of the booking
  const isGuest = booking.guest_id === userId;
  const isHost = booking.host_id === userId;

  if (!isGuest && !isHost) {
    throw new ForbiddenError('You can only review bookings you were part of');
  }

  // Determine review type and reviewee
  const reviewType = isGuest ? REVIEW_TYPES.GUEST_TO_HOST : REVIEW_TYPES.HOST_TO_GUEST;
  const revieweeId = isGuest ? booking.host_id : booking.guest_id;

  if (!revieweeId || !booking.property_id) {
    throw new BadRequestError('Invalid booking data');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findFirst({
    where: {
      booking_id,
      reviewer_id: userId,
    },
  });

  if (existingReview) {
    throw new BadRequestError('You have already reviewed this booking');
  }

  // Create review with photos
  const review = await prisma.review.create({
    data: {
      booking_id,
      property_id: booking.property_id,
      reviewer_id: userId,
      reviewee_id: revieweeId,
      review_type: reviewType,
      ...reviewData,
      status: 'published',
      photos: photo_urls
        ? {
            create: photo_urls.map((url) => ({
              photo_url: url,
            })),
          }
        : undefined,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      photos: true,
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  // TODO: Send notification to reviewee about new review
  // TODO: Update property/user average ratings

  return review;
};

/**
 * Get review by ID
 */
export const getReviewById = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      reviewer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
          student_verified: true,
          id_verified: true,
        },
      },
      reviewee: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
        },
      },
      booking: {
        select: {
          id: true,
          check_in_date: true,
          check_out_date: true,
        },
      },
      photos: true,
    },
  });

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  return review;
};

/**
 * Get reviews with filters
 */
export const getReviews = async (filters: GetReviewsInput) => {
  const { property_id, reviewer_id, reviewee_id, min_rating, page = 1, limit = 20 } = filters;

  const where: any = {
    status: 'published', // Only show published reviews
  };

  if (property_id) {
    where.property_id = property_id;
  }

  if (reviewer_id) {
    where.reviewer_id = reviewer_id;
  }

  if (reviewee_id) {
    where.reviewee_id = reviewee_id;
  }

  if (min_rating) {
    where.overall_rating = { gte: min_rating };
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reviewer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_photo_url: true,
            student_verified: true,
            id_verified: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
          },
        },
        photos: {
          select: {
            id: true,
            photo_url: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update review (only by reviewer, before host responds)
 */
export const updateReview = async (reviewId: string, userId: string, data: UpdateReviewInput) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      reviewer_id: true,
      host_response: true,
    },
  });

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  // Only the reviewer can update their review
  if (review.reviewer_id !== userId) {
    throw new ForbiddenError('You can only update your own reviews');
  }

  // Cannot update after host has responded
  if (review.host_response) {
    throw new BadRequestError('Cannot update review after host has responded');
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: {
      reviewer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      photos: true,
    },
  });

  return updatedReview;
};

/**
 * Delete review (only by reviewer, within certain time period)
 */
export const deleteReview = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      reviewer_id: true,
      host_response: true,
      created_at: true,
    },
  });

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  // Only the reviewer can delete their review
  if (review.reviewer_id !== userId) {
    throw new ForbiddenError('You can only delete your own reviews');
  }

  // Cannot delete after host has responded
  if (review.host_response) {
    throw new BadRequestError('Cannot delete review after host has responded');
  }

  // Cannot delete after 48 hours (configurable)
  const hoursSinceCreation = (new Date().getTime() - review.created_at.getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 48) {
    throw new BadRequestError('Reviews can only be deleted within 48 hours of posting');
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: 'Review deleted successfully' };
};

/**
 * Host response to a review
 */
export const addHostResponse = async (reviewId: string, userId: string, data: HostResponseInput) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      reviewee_id: true,
      review_type: true,
      host_response: true,
      property: {
        select: {
          host_id: true,
        },
      },
    },
  });

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  // Only the property host can respond (for guest-to-host reviews)
  if (review.review_type !== REVIEW_TYPES.GUEST_TO_HOST) {
    throw new BadRequestError('Only guest-to-host reviews can receive host responses');
  }

  if (review.property.host_id !== userId) {
    throw new ForbiddenError('Only the property host can respond to this review');
  }

  // Check if host has already responded
  if (review.host_response) {
    throw new BadRequestError('You have already responded to this review');
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      host_response: data.host_response,
      host_responded_at: new Date(),
      updated_at: new Date(),
    },
    include: {
      reviewer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
      photos: true,
    },
  });

  // TODO: Send notification to reviewer about host response

  return updatedReview;
};

/**
 * Get reviews for a property (public endpoint)
 */
export const getPropertyReviews = async (propertyId: string, page: number = 1, limit: number = 20) => {
  // Verify property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        property_id: propertyId,
        status: 'published',
        review_type: REVIEW_TYPES.GUEST_TO_HOST, // Only show guest reviews for properties
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reviewer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_photo_url: true,
            student_verified: true,
            id_verified: true,
          },
        },
        booking: {
          select: {
            check_in_date: true,
            check_out_date: true,
          },
        },
        photos: true,
      },
    }),
    prisma.review.count({
      where: {
        property_id: propertyId,
        status: 'published',
        review_type: REVIEW_TYPES.GUEST_TO_HOST,
      },
    }),
  ]);

  // Calculate average ratings
  const allReviews = await prisma.review.findMany({
    where: {
      property_id: propertyId,
      status: 'published',
      review_type: REVIEW_TYPES.GUEST_TO_HOST,
    },
    select: {
      overall_rating: true,
      cleanliness_rating: true,
      accuracy_rating: true,
      location_rating: true,
      communication_rating: true,
      value_rating: true,
    },
  });

  const avgRatings =
    allReviews.length > 0
      ? {
          overall: allReviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) / allReviews.length,
          cleanliness:
            allReviews.filter((r) => r.cleanliness_rating).reduce((sum, r) => sum + Number(r.cleanliness_rating), 0) /
            allReviews.filter((r) => r.cleanliness_rating).length,
          accuracy:
            allReviews.filter((r) => r.accuracy_rating).reduce((sum, r) => sum + Number(r.accuracy_rating), 0) /
            allReviews.filter((r) => r.accuracy_rating).length,
          location:
            allReviews.filter((r) => r.location_rating).reduce((sum, r) => sum + Number(r.location_rating), 0) /
            allReviews.filter((r) => r.location_rating).length,
          communication:
            allReviews.filter((r) => r.communication_rating).reduce((sum, r) => sum + Number(r.communication_rating), 0) /
            allReviews.filter((r) => r.communication_rating).length,
          value:
            allReviews.filter((r) => r.value_rating).reduce((sum, r) => sum + Number(r.value_rating), 0) /
            allReviews.filter((r) => r.value_rating).length,
        }
      : null;

  return {
    reviews,
    average_ratings: avgRatings,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};
