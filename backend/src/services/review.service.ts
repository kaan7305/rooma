import supabase from '../config/supabase';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { BOOKING_STATUS, REVIEW_TYPES } from '../utils/constants';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  HostResponseInput,
  GetReviewsInput,
} from '../validators/review.validator';
import type { 
  ReviewRow, ReviewInsert, ReviewUpdate,
  BookingRow, PropertyRow, UserRow, ReviewPhotoRow, ReviewPhotoInsert
} from '../types/supabase-helpers';

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
    .single() as { data: Pick<BookingRow, 'id' | 'booking_status' | 'guest_id' | 'host_id' | 'property_id' | 'check_out_date'> | null; error: any };

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
    .maybeSingle() as { data: Pick<ReviewRow, 'id'> | null; error: any };

  if (existingReview) {
    throw new BadRequestError('You have already reviewed this booking');
  }

  // Create review
  const reviewInsertData: ReviewInsert = {
      booking_id,
      property_id: booking.property_id,
      reviewer_id: userId,
      reviewee_id: revieweeId,
      review_type: reviewType,
      ...reviewData,
      status: 'published',
  };

  const { data: review, error: createError } = await supabase
    .from('reviews')
    .insert(reviewInsertData as any)
    .select()
    .single() as { data: ReviewRow | null; error: any };

  if (createError || !review) {
    throw new Error(createError?.message || 'Failed to create review');
  }

  // Create review photos if provided
  if (photo_urls && photo_urls.length > 0) {
    const photoData: ReviewPhotoInsert[] = photo_urls.map((url) => ({
      review_id: review.id,
              photo_url: url,
    }));

    await supabase.from('review_photos').insert(photoData as any);
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', userId)
    .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url'> | null; error: any };

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title')
    .eq('id', booking.property_id || '')
    .single() as { data: Pick<PropertyRow, 'id' | 'title'> | null; error: any };

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', review.id || '') as { data: ReviewPhotoRow[] | null; error: any };

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
    .single() as { data: ReviewRow | null; error: any };

  if (reviewError || !review) {
    throw new NotFoundError('Review not found');
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url, student_verified, id_verified')
    .eq('id', review.reviewer_id || '')
    .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url' | 'student_verified' | 'id_verified'> | null; error: any };

  // Get reviewee
  const { data: reviewee } = await supabase
    .from('users')
    .select('id, first_name, last_name')
    .eq('id', review.reviewee_id || '')
    .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name'> | null; error: any };

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title, city, country')
    .eq('id', review.property_id || '')
    .single() as { data: Pick<PropertyRow, 'id' | 'title' | 'city' | 'country'> | null; error: any };

  // Get booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, check_in_date, check_out_date')
    .eq('id', review.booking_id || '')
    .single() as { data: Pick<BookingRow, 'id' | 'check_in_date' | 'check_out_date'> | null; error: any };

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', reviewId) as { data: ReviewPhotoRow[] | null; error: any };

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

  const { data: reviewsData, error, count } = await query as { data: ReviewRow[] | null; error: any; count: number | null };

  if (error) {
    throw new Error(error.message);
  }

  // Get related data for each review
  const reviews = await Promise.all(
    (reviewsData || []).map(async (review) => {
      const [reviewerResult, propertyResult, photosResult] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, profile_photo_url, student_verified, id_verified').eq('id', review.reviewer_id || '').single(),
        supabase.from('properties').select('id, title, city, country').eq('id', review.property_id || '').single(),
        supabase.from('review_photos').select('id, photo_url').eq('review_id', review.id || ''),
      ]);

      const reviewer = reviewerResult.data as Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url' | 'student_verified' | 'id_verified'> | null;
      const property = propertyResult.data as Pick<PropertyRow, 'id' | 'title' | 'city' | 'country'> | null;
      const photos = photosResult.data as Array<Pick<ReviewPhotoRow, 'id' | 'photo_url'>> | null;

      return {
        ...review,
        reviewer: reviewer || null,
        property: property || null,
        photos: photos || [],
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
    .single() as { data: Pick<ReviewRow, 'id' | 'reviewer_id' | 'host_response'> | null; error: any };

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

  const updateData: ReviewUpdate = {
      ...data,
      updated_at: new Date().toISOString(),
    };

  const { data: updatedReview, error: updateError } = await supabase
    .from('reviews')
    // @ts-expect-error - Supabase type inference issue with update()
    .update(updateData as any)
    .eq('id', reviewId)
    .select()
    .single() as { data: ReviewRow | null; error: any };

  if (updateError || !updatedReview) {
    throw new Error(updateError?.message || 'Failed to update review');
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', userId)
    .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url'> | null; error: any };

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', reviewId) as { data: ReviewPhotoRow[] | null; error: any };

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
    .single() as { data: Pick<ReviewRow, 'id' | 'reviewer_id' | 'host_response' | 'created_at'> | null; error: any };

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
    .single() as { data: Pick<ReviewRow, 'id' | 'reviewee_id' | 'review_type' | 'host_response' | 'property_id'> | null; error: any };

  if (reviewError || !review) {
    throw new NotFoundError('Review not found');
  }

  // Get property to check host_id
  const { data: property } = await supabase
    .from('properties')
    .select('host_id')
    .eq('id', review.property_id || '')
    .single() as { data: Pick<PropertyRow, 'host_id'> | null; error: any };

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

  const updateData: ReviewUpdate = {
      host_response: data.host_response,
    host_responded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: updatedReview, error: updateError } = await supabase
    .from('reviews')
    // @ts-expect-error - Supabase type inference issue with update()
    .update(updateData as any)
    .eq('id', reviewId)
    .select()
    .single() as { data: ReviewRow | null; error: any };

  if (updateError || !updatedReview) {
    throw new Error(updateError?.message || 'Failed to update review');
  }

  // Get reviewer
  const { data: reviewer } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', updatedReview.reviewer_id || '')
    .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url'> | null; error: any };

  // Get property details
  const { data: propertyData } = await supabase
    .from('properties')
    .select('id, title')
    .eq('id', review.property_id || '')
    .single() as { data: Pick<PropertyRow, 'id' | 'title'> | null; error: any };

  // Get photos
  const { data: photos } = await supabase
    .from('review_photos')
    .select('*')
    .eq('review_id', reviewId) as { data: ReviewPhotoRow[] | null; error: any };

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
    .single() as { data: Pick<PropertyRow, 'id'> | null; error: any };

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
    .range(skip, to) as { data: ReviewRow[] | null; error: any; count: number | null };

  if (reviewsError) {
    throw new Error(reviewsError.message);
  }

  // Get related data for each review
  const reviews = await Promise.all(
    (reviewsData || []).map(async (review) => {
      const [reviewerResult, bookingResult, photosResult] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, profile_photo_url, student_verified, id_verified').eq('id', review.reviewer_id || '').single(),
        supabase.from('bookings').select('check_in_date, check_out_date').eq('id', review.booking_id || '').single(),
        supabase.from('review_photos').select('*').eq('review_id', review.id || ''),
      ]);

      const reviewer = reviewerResult.data as Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url' | 'student_verified' | 'id_verified'> | null;
      const booking = bookingResult.data as Pick<BookingRow, 'check_in_date' | 'check_out_date'> | null;
      const photos = photosResult.data as ReviewPhotoRow[] | null;

      return {
        ...review,
        reviewer: reviewer || null,
        booking: booking || null,
        photos: photos || [],
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
    .eq('review_type', REVIEW_TYPES.GUEST_TO_HOST) as { data: Array<Pick<ReviewRow, 'overall_rating' | 'cleanliness_rating' | 'accuracy_rating' | 'location_rating' | 'communication_rating' | 'value_rating'>> | null; error: any };

  const avgRatings =
    allReviews && allReviews.length > 0
      ? {
          overall: allReviews.reduce((sum, r) => sum + Number(r.overall_rating || 0), 0) / allReviews.length,
          cleanliness:
            allReviews.filter((r) => r.cleanliness_rating).reduce((sum, r) => sum + Number(r.cleanliness_rating || 0), 0) /
            (allReviews.filter((r) => r.cleanliness_rating).length || 1),
          accuracy:
            allReviews.filter((r) => r.accuracy_rating).reduce((sum, r) => sum + Number(r.accuracy_rating || 0), 0) /
            (allReviews.filter((r) => r.accuracy_rating).length || 1),
          location:
            allReviews.filter((r) => r.location_rating).reduce((sum, r) => sum + Number(r.location_rating || 0), 0) /
            (allReviews.filter((r) => r.location_rating).length || 1),
          communication:
            allReviews.filter((r) => r.communication_rating).reduce((sum, r) => sum + Number(r.communication_rating || 0), 0) /
            (allReviews.filter((r) => r.communication_rating).length || 1),
          value:
            allReviews.filter((r) => r.value_rating).reduce((sum, r) => sum + Number(r.value_rating || 0), 0) /
            (allReviews.filter((r) => r.value_rating).length || 1),
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
