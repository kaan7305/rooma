import prisma from '../config/database';
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
  const host = await prisma.user.findUnique({
    where: { id: hostId },
    select: { user_type: true },
  });

  if (!host || (host.user_type !== 'host' && host.user_type !== 'both')) {
    throw new ForbiddenError('Only hosts can create properties');
  }

  // If university is provided, verify it exists
  if (university_id) {
    const university = await prisma.university.findUnique({
      where: { id: university_id },
    });

    if (!university) {
      throw new NotFoundError('University not found');
    }
  }

  // Create property with amenities
  const property = await prisma.property.create({
    data: {
      ...propertyData,
      host_id: hostId,
      status: PROPERTY_STATUS.PENDING_REVIEW, // Pending admin verification
      nearest_university_id: university_id,
      distance_to_university_km: distance_to_university_km,
      // Connect amenities if provided
      amenities: amenity_ids
        ? {
            create: amenity_ids.map((amenityId) => ({
              amenity: { connect: { id: amenityId } },
            })),
          }
        : undefined,
    },
    include: {
      amenities: {
        include: {
          amenity: true,
        },
      },
      nearest_university: true,
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
          student_verified: true,
          id_verified: true,
        },
      },
    },
  });

  return property;
};

/**
 * Get property by ID with full details
 */
export const getPropertyById = async (propertyId: string, userId: string | undefined = undefined) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
          bio: true,
          student_verified: true,
          id_verified: true,
          created_at: true,
        },
      },
      photos: {
        orderBy: { display_order: 'asc' },
      },
      amenities: {
        include: {
          amenity: true,
        },
      },
      nearest_university: true,
      reviews: {
        where: { status: 'published' },
        include: {
          reviewer: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profile_photo_url: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        take: 10,
      },
      bookings: {
        where: {
          booking_status: { in: ['confirmed', 'completed'] },
        },
        select: {
          check_in_date: true,
          check_out_date: true,
          booking_status: true,
        },
      },
    },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  // Only show inactive/pending properties to the owner
  if (property.status !== PROPERTY_STATUS.ACTIVE && property.host_id !== userId) {
    throw new NotFoundError('Property not found');
  }

  // Calculate average rating
  const avgRating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) / property.reviews.length
      : null;

  const { reviews, bookings, ...propertyData } = property;

  return {
    ...propertyData,
    average_rating: avgRating,
    total_reviews: reviews.length,
    reviews: reviews.slice(0, 5), // Return first 5 reviews with property details
    booked_dates: bookings.map((b) => ({
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

  // Execute query with pagination
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        host: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_photo_url: true,
            student_verified: true,
            id_verified: true,
          },
        },
        photos: {
          take: 1,
          orderBy: { display_order: 'asc' },
        },
        nearest_university: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
        reviews: {
          where: { status: 'published' },
          select: {
            overall_rating: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

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
  const existingProperty = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { host_id: true },
  });

  if (!existingProperty) {
    throw new NotFoundError('Property not found');
  }

  if (existingProperty.host_id !== hostId) {
    throw new ForbiddenError('You can only update your own properties');
  }

  const { amenity_ids, university_id, distance_to_university_km, ...propertyData } = data;

  // If university is being updated, verify it exists
  if (university_id) {
    const university = await prisma.university.findUnique({
      where: { id: university_id },
    });

    if (!university) {
      throw new NotFoundError('University not found');
    }
  }

  // Update property
  const property = await prisma.property.update({
    where: { id: propertyId },
    data: {
      ...propertyData,
      nearest_university_id: university_id,
      distance_to_university_km: distance_to_university_km,
      updated_at: new Date(),
      // Update amenities if provided
      amenities:
        amenity_ids !== undefined
          ? {
              deleteMany: {}, // Remove all existing amenities
              create: amenity_ids.map((amenityId) => ({
                amenity: { connect: { id: amenityId } },
              })),
            }
          : undefined,
    },
    include: {
      amenities: {
        include: {
          amenity: true,
        },
      },
      nearest_university: true,
      photos: {
        orderBy: { display_order: 'asc' },
      },
    },
  });

  return property;
};

/**
 * Delete property
 */
export const deleteProperty = async (propertyId: string, hostId: string) => {
  // Verify property exists and belongs to host
  const existingProperty = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { host_id: true },
  });

  if (!existingProperty) {
    throw new NotFoundError('Property not found');
  }

  if (existingProperty.host_id !== hostId) {
    throw new ForbiddenError('You can only delete your own properties');
  }

  // Check for active bookings
  const activeBookings = await prisma.booking.count({
    where: {
      property_id: propertyId,
      booking_status: { in: ['confirmed', 'completed'] },
    },
  });

  if (activeBookings > 0) {
    throw new BadRequestError('Cannot delete property with active bookings');
  }

  // Soft delete by setting status to inactive
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      status: PROPERTY_STATUS.INACTIVE,
      updated_at: new Date(),
    },
  });

  return { message: 'Property deleted successfully' };
};

/**
 * Add photo to property
 */
export const addPhoto = async (propertyId: string, hostId: string, data: AddPhotoInput) => {
  // Verify property exists and belongs to host
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { host_id: true, photos: true },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  if (property.host_id !== hostId) {
    throw new ForbiddenError('You can only add photos to your own properties');
  }

  // Limit to 20 photos per property
  if (property.photos.length >= 20) {
    throw new BadRequestError('Maximum 20 photos per property');
  }

  // Set display order to last if not provided
  const displayOrder = data.display_order ?? property.photos.length;

  const photo = await prisma.propertyPhoto.create({
    data: {
      property_id: propertyId,
      photo_url: data.photo_url,
      caption: data.caption,
      display_order: displayOrder,
    },
  });

  return photo;
};

/**
 * Delete photo from property
 */
export const deletePhoto = async (propertyId: string, photoId: string, hostId: string) => {
  // Verify property exists and belongs to host
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { host_id: true },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  if (property.host_id !== hostId) {
    throw new ForbiddenError('You can only delete photos from your own properties');
  }

  // Verify photo exists and belongs to this property
  const photo = await prisma.propertyPhoto.findFirst({
    where: {
      id: photoId,
      property_id: propertyId,
    },
  });

  if (!photo) {
    throw new NotFoundError('Photo not found');
  }

  await prisma.propertyPhoto.delete({
    where: { id: photoId },
  });

  return { message: 'Photo deleted successfully' };
};

/**
 * Get property availability (booked dates)
 */
export const getAvailability = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      id: true,
      bookings: {
        where: {
          booking_status: { in: ['confirmed', 'completed'] },
        },
        select: {
          check_in_date: true,
          check_out_date: true,
          booking_status: true,
        },
        orderBy: {
          check_in_date: 'asc',
        },
      },
    },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  return {
    property_id: property.id,
    booked_dates: property.bookings.map((booking) => ({
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
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, status: true },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        property_id: propertyId,
        status: 'published',
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
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({
      where: {
        property_id: propertyId,
        status: 'published',
      },
    }),
  ]);

  // Calculate average ratings
  const allReviews = await prisma.review.findMany({
    where: {
      property_id: propertyId,
      status: 'published',
    },
    select: {
      overall_rating: true,
      cleanliness_rating: true,
      accuracy_rating: true,
      communication_rating: true,
      location_rating: true,
      value_rating: true,
    },
  });

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
