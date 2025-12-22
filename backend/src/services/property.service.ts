import supabase from '../config/supabase';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { PROPERTY_STATUS } from '../utils/constants';
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
  SearchPropertiesInput,
  AddPhotoInput,
} from '../validators/property.validator';

/**
 * Create new property listing
 */
export const createProperty = async (hostId: string, data: CreatePropertyInput) => {
  const { amenity_ids, university_id, distance_to_university_km, ...propertyData } = data;

  // Verify host exists and is actually a host
  const { data: host, error: hostError } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', hostId)
    .single();

  if (hostError || !host || (host.user_type !== 'host' && host.user_type !== 'both')) {
    throw new ForbiddenError('Only hosts can create properties');
  }

  // If university is provided, verify it exists
  if (university_id) {
    const { data: university, error: uniError } = await supabase
      .from('universities')
      .select('id')
      .eq('id', university_id)
      .single();

    if (uniError || !university) {
      throw new NotFoundError('University not found');
    }
  }

  // Create property
  const { data: property, error: createError } = await supabase
    .from('properties')
    .insert({
      ...propertyData,
      host_id: hostId,
      status: PROPERTY_STATUS.PENDING_REVIEW, // Pending admin verification
      nearest_university_id: university_id,
      distance_to_university_km: distance_to_university_km,
    })
    .select()
    .single();

  if (createError || !property) {
    throw new Error(createError?.message || 'Failed to create property');
  }

  // Create property amenities if provided
  if (amenity_ids && amenity_ids.length > 0) {
    const amenityData = amenity_ids.map((amenityId) => ({
      property_id: property.id,
      amenity_id: amenityId,
    }));

    await supabase.from('property_amenities').insert(amenityData);
  }

  // Get amenities
  const { data: propertyAmenities } = await supabase
    .from('property_amenities')
    .select('amenity_id, amenity:amenities(*)')
    .eq('property_id', property.id);

  // Get nearest university
  const { data: nearestUniversity } = await supabase
    .from('universities')
    .select('*')
    .eq('id', property.nearest_university_id)
    .maybeSingle();

  // Get host
  const { data: hostData } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url, student_verified, id_verified')
    .eq('id', hostId)
    .single();

  return {
    ...property,
    amenities: propertyAmenities || [],
    nearest_university: nearestUniversity,
    host: hostData || null,
  };
};

/**
 * Get property by ID with full details
 */
export const getPropertyById = async (propertyId: string, userId: string | undefined = undefined) => {
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    throw new NotFoundError('Property not found');
  }

  // Only show inactive/pending properties to the owner
  if (property.status !== PROPERTY_STATUS.ACTIVE && property.host_id !== userId) {
    throw new NotFoundError('Property not found');
  }

  // Get host
  const { data: host } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url, bio, student_verified, id_verified, created_at')
    .eq('id', property.host_id)
    .single();

  // Get photos
  const { data: photos } = await supabase
    .from('property_photos')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  // Get amenities
  const { data: propertyAmenities } = await supabase
    .from('property_amenities')
    .select('amenity_id, amenity:amenities(*)')
    .eq('property_id', propertyId);

  // Get nearest university
  const { data: nearestUniversity } = await supabase
    .from('universities')
    .select('*')
    .eq('id', property.nearest_university_id)
    .maybeSingle();

  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, overall_rating, review_text, created_at, reviewer_id')
    .eq('property_id', propertyId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10);

  // Get reviewers for reviews
  const reviewsWithReviewers = await Promise.all(
    (reviews || []).map(async (review) => {
      const { data: reviewer } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo_url')
        .eq('id', review.reviewer_id)
        .single();

      return {
        ...review,
        reviewer: reviewer || null,
      };
    })
  );

  // Get bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('check_in_date, check_out_date, booking_status')
    .eq('property_id', propertyId)
    .in('booking_status', ['confirmed', 'completed']);

  // Calculate average rating
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) / reviews.length
      : null;

  return {
    ...property,
    host: host || null,
    photos: photos || [],
    amenities: propertyAmenities || [],
    nearest_university: nearestUniversity,
    average_rating: avgRating,
    total_reviews: reviews?.length || 0,
    reviews: reviewsWithReviewers.slice(0, 5),
    booked_dates: (bookings || []).map((b) => ({
      start_date: b.check_in_date,
      end_date: b.check_out_date,
    })),
  };
};

/**
 * Search properties with filters and pagination
 */
export const searchProperties = async (filters: SearchPropertiesInput) => {
  const {
    city,
    country,
    university_id,
    min_price,
    max_price,
    bedrooms,
    bathrooms,
    property_type,
    amenity_ids,
    check_in,
    check_out,
    max_distance_km,
    page = 1,
    limit = 20,
    sort_by = 'created_at',
  } = filters;

  // Build where clause
  const where: any = {
    status: PROPERTY_STATUS.ACTIVE,
  };

  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (country) where.country = { contains: country, mode: 'insensitive' };
  if (university_id) where.nearest_university_id = university_id;
  if (min_price) where.monthly_price_cents = { ...where.monthly_price_cents, gte: min_price };
  if (max_price) where.monthly_price_cents = { ...where.monthly_price_cents, lte: max_price };
  if (bedrooms) where.bedrooms = { gte: bedrooms };
  if (bathrooms) where.bathrooms = { gte: bathrooms };
  if (property_type) where.property_type = property_type;
  if (max_distance_km && university_id) {
    where.distance_to_university_km = { lte: max_distance_km };
  }

  // Filter by amenities (must have all specified amenities)
  if (amenity_ids && amenity_ids.length > 0) {
    where.amenities = {
      some: {
        amenity_id: { in: amenity_ids },
      },
    };
  }

  // Filter by availability (no overlapping bookings)
  if (check_in && check_out) {
    where.bookings = {
      none: {
        booking_status: { in: ['confirmed', 'completed'] },
        OR: [
          {
            // Booking starts during search period
            check_in_date: { gte: new Date(check_in), lte: new Date(check_out) },
          },
          {
            // Booking ends during search period
            check_out_date: { gte: new Date(check_in), lte: new Date(check_out) },
          },
          {
            // Booking completely overlaps search period
            AND: [{ check_in_date: { lte: new Date(check_in) } }, { check_out_date: { gte: new Date(check_out) } }],
          },
        ],
      },
    };
  }

  // Build orderBy clause
  let orderBy: any = {};
  switch (sort_by) {
    case 'price_asc':
      orderBy = { monthly_price_cents: 'asc' };
      break;
    case 'price_desc':
      orderBy = { monthly_price_cents: 'desc' };
      break;
    case 'distance':
      orderBy = { distance_to_university_km: 'asc' };
      break;
    case 'created_at':
    default:
      orderBy = { created_at: 'desc' };
  }

  // Build base query
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', PROPERTY_STATUS.ACTIVE);

  // Apply filters
  if (city) {
    query = query.ilike('city', `%${city}%`);
  }
  if (country) {
    query = query.ilike('country', `%${country}%`);
  }
  if (university_id) {
    query = query.eq('nearest_university_id', university_id);
  }
  if (min_price) {
    query = query.gte('monthly_price_cents', min_price);
  }
  if (max_price) {
    query = query.lte('monthly_price_cents', max_price);
  }
  if (bedrooms) {
    query = query.gte('bedrooms', bedrooms);
  }
  if (bathrooms) {
    query = query.gte('bathrooms', bathrooms);
  }
  if (property_type) {
    query = query.eq('property_type', property_type);
  }
  if (max_distance_km && university_id) {
    query = query.lte('distance_to_university_km', max_distance_km);
  }

  // Apply ordering
  let orderColumn = 'created_at';
  let orderAscending = false;
  switch (sort_by) {
    case 'price_asc':
      orderColumn = 'monthly_price_cents';
      orderAscending = true;
      break;
    case 'price_desc':
      orderColumn = 'monthly_price_cents';
      orderAscending = false;
      break;
    case 'distance':
      orderColumn = 'distance_to_university_km';
      orderAscending = true;
      break;
    default:
      orderColumn = 'created_at';
      orderAscending = false;
  }

  const skip = (page - 1) * limit;
  const to = skip + limit - 1;
  query = query.order(orderColumn, { ascending: orderAscending }).range(skip, to);

  const { data: propertiesData, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Filter by amenities if specified
  let filteredProperties = propertiesData || [];
  if (amenity_ids && amenity_ids.length > 0) {
    const propertyIdsWithAmenities = new Set<string>();
    
    for (const amenityId of amenity_ids) {
      const { data: propertyAmenities } = await supabase
        .from('property_amenities')
        .select('property_id')
        .eq('amenity_id', amenityId);
      
      (propertyAmenities || []).forEach(pa => propertyIdsWithAmenities.add(pa.property_id));
    }

    // Properties must have ALL specified amenities
    filteredProperties = filteredProperties.filter(p => 
      amenity_ids.every(amenityId => propertyIdsWithAmenities.has(p.id))
    );
  }

  // Filter by availability if check_in and check_out provided
  if (check_in && check_out) {
    const checkInDate = new Date(check_in).toISOString().split('T')[0];
    const checkOutDate = new Date(check_out).toISOString().split('T')[0];

    const propertyIds = filteredProperties.map(p => p.id);
    
    // Get all bookings that overlap with the search period
    const { data: overlappingBookings } = await supabase
      .from('bookings')
      .select('property_id')
      .in('property_id', propertyIds)
      .in('booking_status', ['confirmed', 'completed'])
      .or(`and(check_in_date.lte.${checkOutDate},check_out_date.gt.${checkInDate}),and(check_in_date.lt.${checkOutDate},check_out_date.gte.${checkOutDate}),and(check_in_date.gte.${checkInDate},check_out_date.lte.${checkOutDate})`);

    const bookedPropertyIds = new Set((overlappingBookings || []).map(b => b.property_id));
    filteredProperties = filteredProperties.filter(p => !bookedPropertyIds.has(p.id));
  }

  // Get related data for each property
  const properties = await Promise.all(
    filteredProperties.map(async (property) => {
      const [host, photos, nearestUniversity, reviews] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, profile_photo_url, student_verified, id_verified').eq('id', property.host_id).single(),
        supabase.from('property_photos').select('*').eq('property_id', property.id).order('display_order', { ascending: true }).limit(1),
        property.nearest_university_id ? supabase.from('universities').select('id, name, city, country').eq('id', property.nearest_university_id).single() : { data: null },
        supabase.from('reviews').select('overall_rating').eq('property_id', property.id).eq('status', 'published'),
      ]);

      const avgRating =
        reviews.data && reviews.data.length > 0
          ? reviews.data.reduce((sum, r) => sum + Number(r.overall_rating), 0) / reviews.data.length
          : null;

      return {
        ...property,
        host: host.data || null,
        photos: photos.data || [],
        nearest_university: nearestUniversity.data || null,
        average_rating: avgRating,
        total_reviews: reviews.data?.length || 0,
      };
    })
  );

  const total = count || 0;

  // Add average rating to each property
  const propertiesWithRatings = properties.map((property) => {
    const avgRating =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) / property.reviews.length
        : null;

    const { reviews, ...propertyData } = property;

    return {
      ...propertyData,
      average_rating: avgRating,
      total_reviews: reviews.length,
    };
  });

  return {
    properties: propertiesWithRatings,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update property
 */
export const updateProperty = async (propertyId: string, hostId: string, data: UpdatePropertyInput) => {
  // Verify property exists and belongs to host
  const { data: existingProperty, error: propertyError } = await supabase
    .from('properties')
    .select('host_id')
    .eq('id', propertyId)
    .single();

  if (propertyError || !existingProperty) {
    throw new NotFoundError('Property not found');
  }

  if (existingProperty.host_id !== hostId) {
    throw new ForbiddenError('You can only update your own properties');
  }

  const { amenity_ids, university_id, distance_to_university_km, ...propertyData } = data;

  // If university is being updated, verify it exists
  if (university_id) {
    const { data: university, error: uniError } = await supabase
      .from('universities')
      .select('id')
      .eq('id', university_id)
      .single();

    if (uniError || !university) {
      throw new NotFoundError('University not found');
    }
  }

  // Update property
  const { data: property, error: updateError } = await supabase
    .from('properties')
    .update({
      ...propertyData,
      nearest_university_id: university_id,
      distance_to_university_km: distance_to_university_km,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId)
    .select()
    .single();

  if (updateError || !property) {
    throw new Error(updateError?.message || 'Failed to update property');
  }

  // Update amenities if provided
  if (amenity_ids !== undefined) {
    // Delete all existing amenities
    await supabase
      .from('property_amenities')
      .delete()
      .eq('property_id', propertyId);

    // Create new amenities
    if (amenity_ids.length > 0) {
      const amenityData = amenity_ids.map((amenityId) => ({
        property_id: propertyId,
        amenity_id: amenityId,
      }));

      await supabase.from('property_amenities').insert(amenityData);
    }
  }

  // Get amenities
  const { data: propertyAmenities } = await supabase
    .from('property_amenities')
    .select('amenity_id, amenity:amenities(*)')
    .eq('property_id', propertyId);

  // Get nearest university
  const { data: nearestUniversity } = await supabase
    .from('universities')
    .select('*')
    .eq('id', property.nearest_university_id)
    .maybeSingle();

  // Get photos
  const { data: photos } = await supabase
    .from('property_photos')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  return {
    ...property,
    amenities: propertyAmenities || [],
    nearest_university: nearestUniversity,
    photos: photos || [],
  };
};

/**
 * Delete property
 */
export const deleteProperty = async (propertyId: string, hostId: string) => {
  // Verify property exists and belongs to host
  const { data: existingProperty, error: propertyError } = await supabase
    .from('properties')
    .select('host_id')
    .eq('id', propertyId)
    .single();

  if (propertyError || !existingProperty) {
    throw new NotFoundError('Property not found');
  }

  if (existingProperty.host_id !== hostId) {
    throw new ForbiddenError('You can only delete your own properties');
  }

  // Check for active bookings
  const { count: activeBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', propertyId)
    .in('booking_status', ['confirmed', 'completed']);

  if ((activeBookings || 0) > 0) {
    throw new BadRequestError('Cannot delete property with active bookings');
  }

  // Soft delete by setting status to inactive
  await supabase
    .from('properties')
    .update({
      status: PROPERTY_STATUS.INACTIVE,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId);

  return { message: 'Property deleted successfully' };
};

/**
 * Add photo to property
 */
export const addPhoto = async (propertyId: string, hostId: string, data: AddPhotoInput) => {
  // Verify property exists and belongs to host
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('host_id')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    throw new NotFoundError('Property not found');
  }

  if (property.host_id !== hostId) {
    throw new ForbiddenError('You can only add photos to your own properties');
  }

  // Get existing photos count
  const { count: photoCount } = await supabase
    .from('property_photos')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', propertyId);

  // Limit to 20 photos per property
  if ((photoCount || 0) >= 20) {
    throw new BadRequestError('Maximum 20 photos per property');
  }

  // Set display order to last if not provided
  const displayOrder = data.display_order ?? (photoCount || 0);

  const { data: photo, error: createError } = await supabase
    .from('property_photos')
    .insert({
      property_id: propertyId,
      photo_url: data.photo_url,
      caption: data.caption,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (createError || !photo) {
    throw new Error(createError?.message || 'Failed to create photo');
  }

  return photo;
};

/**
 * Delete photo from property
 */
export const deletePhoto = async (propertyId: string, photoId: string, hostId: string) => {
  // Verify property exists and belongs to host
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('host_id')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    throw new NotFoundError('Property not found');
  }

  if (property.host_id !== hostId) {
    throw new ForbiddenError('You can only delete photos from your own properties');
  }

  // Verify photo exists and belongs to this property
  const { data: photo, error: photoError } = await supabase
    .from('property_photos')
    .select('*')
    .eq('id', photoId)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (photoError || !photo) {
    throw new NotFoundError('Photo not found');
  }

  await supabase
    .from('property_photos')
    .delete()
    .eq('id', photoId);

  return { message: 'Photo deleted successfully' };
};

/**
 * Get property availability (booked dates)
 */
export const getAvailability = async (propertyId: string) => {
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    throw new NotFoundError('Property not found');
  }

  // Get bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('check_in_date, check_out_date, booking_status')
    .eq('property_id', propertyId)
    .in('booking_status', ['confirmed', 'completed'])
    .order('check_in_date', { ascending: true });

  return {
    property_id: property.id,
    booked_dates: (bookings || []).map((booking) => ({
      start_date: booking.check_in_date,
      end_date: booking.check_out_date,
      status: booking.booking_status,
    })),
  };
};

/**
 * Get property reviews
 */
export const getPropertyReviews = async (propertyId: string, page: number = 1, limit: number = 10) => {
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id, status')
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
    .order('created_at', { ascending: false })
    .range(skip, to);

  if (reviewsError) {
    throw new Error(reviewsError.message);
  }

  // Get reviewers for each review
  const reviews = await Promise.all(
    (reviewsData || []).map(async (review) => {
      const { data: reviewer } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo_url')
        .eq('id', review.reviewer_id)
        .single();

      return {
        ...review,
        reviewer: reviewer || null,
      };
    })
  );

  const total = count || 0;

  // Calculate average ratings
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('overall_rating, cleanliness_rating, accuracy_rating, communication_rating, location_rating, value_rating')
    .eq('property_id', propertyId)
    .eq('status', 'published');

  const avgRatings =
    allReviews.length > 0
      ? {
          overall: allReviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) / allReviews.length,
          cleanliness: allReviews.reduce((sum, r) => sum + Number(r.cleanliness_rating), 0) / allReviews.length,
          accuracy: allReviews.reduce((sum, r) => sum + Number(r.accuracy_rating), 0) / allReviews.length,
          communication: allReviews.reduce((sum, r) => sum + Number(r.communication_rating), 0) / allReviews.length,
          location: allReviews.reduce((sum, r) => sum + Number(r.location_rating), 0) / allReviews.length,
          value: allReviews.reduce((sum, r) => sum + Number(r.value_rating), 0) / allReviews.length,
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
