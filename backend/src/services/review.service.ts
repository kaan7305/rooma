import supabase from '../config/supabase';
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
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, booking_status, guest_id, host_id, property_id, check_out_date')
    .eq('id', booking_id)
    .single();

  if (bookingError || !booking) {
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
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', booking_id)
    .eq('reviewer_id', userId)
    .maybeSingle();

  if (existingReview) {
    throw new BadRequestError('You have already reviewed this booking');
  }

  // Create review
  const { data: review, error: createError } = await supabase
    .from('reviews')
    .insert({
      booking_id,
      property_id: booking.property_id,
      reviewer_id: userId,
      reviewee_id: revieweeId,
      review_type: reviewType,
      ...reviewData,
      status: 'published',
    })
    .select()
    .single();

  if (createError || !review) {
    throw new Error(createError?.message || 'Failed to create review');
  }

  // Create review photos if provided
  if (photo_urls && photo_urls.length > 0) {
    const photoData = photo_urls.map((url) => ({
      review_id: review.id,
      photo_url: url,
    }));

    await supabase.from('review_photos').insert(photoData);
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', userId)
    .single();

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title')
    .eq('id', booking.property_id)
    .single();

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', review.id);

  // TODO: Send notification to reviewee about new review
  // TODO: Update property/user average ratings

  return {
    ...review,
    reviewer: reviewer || null,
    photos: photos || [],
    property: property || null,
  };
};

/**
 * Get review by ID
 */
export const getReviewById = async (reviewId: string) => {
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();

  if (reviewError || !review) {
    throw new NotFoundError('Review not found');
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url, student_verified, id_verified')
    .eq('id', review.reviewer_id)
    .single();

  // Get reviewee
  const { data: reviewee } = await supabase
    .from('users')
    .select('id, first_name, last_name')
    .eq('id', review.reviewee_id)
    .single();

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title, city, country')
    .eq('id', review.property_id)
    .single();

  // Get booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, check_in_date, check_out_date')
    .eq('id', review.booking_id)
    .single();

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', reviewId);

  return {
    ...review,
    reviewer: reviewer || null,
    reviewee: reviewee || null,
    property: property || null,
    booking: booking || null,
    photos: photos || [],
  };
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

  // Build query
  let query = supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (property_id) {
    query = query.eq('property_id', property_id);
  }
  if (reviewer_id) {
    query = query.eq('reviewer_id', reviewer_id);
  }
  if (reviewee_id) {
    query = query.eq('reviewee_id', reviewee_id);
  }
  if (min_rating) {
    query = query.gte('overall_rating', min_rating);
  }

  const skip = (page - 1) * limit;
  const to = skip + limit - 1;
  query = query.order('created_at', { ascending: false }).range(skip, to);

  const { data: reviewsData, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Get related data for each review
  const reviews = await Promise.all(
    (reviewsData || []).map(async (review) => {
      const [reviewer, property, photos] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, profile_photo_url, student_verified, id_verified').eq('id', review.reviewer_id).single(),
        supabase.from('properties').select('id, title, city, country').eq('id', review.property_id).single(),
        supabase.from('review_photos').select('id, photo_url').eq('review_id', review.id),
      ]);

      return {
        ...review,
        reviewer: reviewer.data || null,
        property: property.data || null,
        photos: photos.data || [],
      };
    })
  );

  const total = count || 0;

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
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('id, reviewer_id, host_response')
    .eq('id', reviewId)
    .single();

  if (reviewError || !review) {
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

  const { data: updatedReview, error: updateError } = await supabase
    .from('reviews')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (updateError || !updatedReview) {
    throw new Error(updateError?.message || 'Failed to update review');
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', userId)
    .single();

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', reviewId);

  return {
    ...updatedReview,
    reviewer: reviewer || null,
    photos: photos || [],
  };
};

/**
 * Delete review (only by reviewer, within certain time period)
 */
export const deleteReview = async (reviewId: string, userId: string) => {
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('id, reviewer_id, host_response, created_at')
    .eq('id', reviewId)
    .single();

  if (reviewError || !review) {
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
  const hoursSinceCreation = (new Date().getTime() - new Date(review.created_at).getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 48) {
    throw new BadRequestError('Reviews can only be deleted within 48 hours of posting');
  }

  await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  return { message: 'Review deleted successfully' };
};

/**
 * Host response to a review
 */
export const addHostResponse = async (reviewId: string, userId: string, data: HostResponseInput) => {
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('id, reviewee_id, review_type, host_response, property_id')
    .eq('id', reviewId)
    .single();

  if (reviewError || !review) {
    throw new NotFoundError('Review not found');
  }

  // Get property to check host_id
  const { data: property } = await supabase
    .from('properties')
    .select('host_id')
    .eq('id', review.property_id)
    .single();

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  // Only the property host can respond (for guest-to-host reviews)
  if (review.review_type !== REVIEW_TYPES.GUEST_TO_HOST) {
    throw new BadRequestError('Only guest-to-host reviews can receive host responses');
  }

  if (property.host_id !== userId) {
    throw new ForbiddenError('Only the property host can respond to this review');
  }

  // Check if host has already responded
  if (review.host_response) {
    throw new BadRequestError('You have already responded to this review');
  }

  const { data: updatedReview, error: updateError } = await supabase
    .from('reviews')
    .update({
      host_response: data.host_response,
      host_responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (updateError || !updatedReview) {
    throw new Error(updateError?.message || 'Failed to update review');
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', updatedReview.reviewer_id)
    .single();

  // Get property details
  const { data: propertyData } = await supabase
    .from('properties')
    .select('id, title')
    .eq('id', review.property_id)
    .single();

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', reviewId);

  // TODO: Send notification to reviewer about host response

  return {
    ...updatedReview,
    reviewer: reviewer || null,
    property: propertyData || null,
    photos: photos || [],
  };
};

/**
 * Get reviews for a property (public endpoint)
 */
export const getPropertyReviews = async (propertyId: string, page: number = 1, limit: number = 20) => {
  // Verify property exists
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    throw new NotFoundError('Property not found');
  }

  const skip = (page - 1) * limit;
  const to = skip + limit - 1;

  // Get reviews
  const { data: reviewsData, error: reviewsError, count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('property_id', propertyId)
    .eq('status', 'published')
    .eq('review_type', REVIEW_TYPES.GUEST_TO_HOST)
    .order('created_at', { ascending: false })
    .range(skip, to);

  if (reviewsError) {
    throw new Error(reviewsError.message);
  }

  // Get related data for each review
  const reviews = await Promise.all(
    (reviewsData || []).map(async (review) => {
      const [reviewer, booking, photos] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, profile_photo_url, student_verified, id_verified').eq('id', review.reviewer_id).single(),
        supabase.from('bookings').select('check_in_date, check_out_date').eq('id', review.booking_id).single(),
        supabase.from('review_photos').select('*').eq('review_id', review.id),
      ]);

      return {
        ...review,
        reviewer: reviewer.data || null,
        booking: booking.data || null,
        photos: photos.data || [],
      };
    })
  );

  const total = count || 0;

  // Calculate average ratings
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('overall_rating, cleanliness_rating, accuracy_rating, location_rating, communication_rating, value_rating')
    .eq('property_id', propertyId)
    .eq('status', 'published')
    .eq('review_type', REVIEW_TYPES.GUEST_TO_HOST);

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
