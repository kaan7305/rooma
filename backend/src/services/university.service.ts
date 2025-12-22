import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import type { SearchUniversitiesInput } from '../validators/university.validator';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Search universities with filters
 * GET /api/universities
 */
export const searchUniversities = async (filters: SearchUniversitiesInput) => {
  const { q, city, country, latitude, longitude, radius_km, page, limit } = filters;

  // Build where clause
  const where: any = {};

  // Text search across name, city, country
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
      { country: { contains: q, mode: 'insensitive' } },
    ];
  }

  // Location filters
  if (city) {
    where.city = { equals: city, mode: 'insensitive' };
  }
  if (country) {
    where.country = { equals: country, mode: 'insensitive' };
  }

  // If proximity search is requested, we need to fetch all universities first
  // and then filter by distance (Prisma doesn't support geospatial queries natively)
  let universities;
  let total;

  if (latitude !== undefined && longitude !== undefined && radius_km !== undefined) {
    // Fetch all universities (or a reasonable subset)
    const allUniversities = await prisma.university.findMany({
      where,
      include: {
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    // Filter by distance
    const universitiesWithDistance = allUniversities
      .filter((uni) => uni.latitude !== null && uni.longitude !== null)
      .map((uni) => {
        const uniLat = Number(uni.latitude);
        const uniLon = Number(uni.longitude);
        const distance = calculateDistance(latitude, longitude, uniLat, uniLon);
        return {
          ...uni,
          distance_km: Math.round(distance * 10) / 10, // Round to 1 decimal
        };
      })
      .filter((uni) => uni.distance_km <= radius_km)
      .sort((a, b) => a.distance_km - b.distance_km);

    total = universitiesWithDistance.length;

    // Apply pagination
    const skip = (page - 1) * limit;
    universities = universitiesWithDistance.slice(skip, skip + limit);
  } else {
    // Regular search without proximity
    const skip = (page - 1) * limit;

    [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
      }),
      prisma.university.count({ where }),
    ]);
  }

  // Format response
  const formattedUniversities = universities.map((uni) => ({
    id: uni.id,
    name: uni.name,
    city: uni.city,
    country: uni.country,
    latitude: uni.latitude,
    longitude: uni.longitude,
    property_count: (uni._count as any).properties || 0,
    distance_km: (uni as any).distance_km || undefined,
  }));

  return {
    universities: formattedUniversities,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get university by ID with nearby properties
 * GET /api/universities/:id
 */
export const getUniversityById = async (universityId: string) => {
  const university = await prisma.university.findUnique({
    where: { id: universityId },
    include: {
      properties: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              description: true,
              property_type: true,
              city: true,
              country: true,
              latitude: true,
              longitude: true,
              bedrooms: true,
              bathrooms: true,
              max_guests: true,
              monthly_price_cents: true,
              status: true,
              photos: {
                take: 1,
                orderBy: { display_order: 'asc' },
                select: { photo_url: true },
              },
              host: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  profile_photo_url: true,
                },
              },
            },
          },
        },
        orderBy: {
          distance_km: 'asc',
        },
        take: 20, // Limit to 20 closest properties
      },
      _count: {
        select: {
          properties: true,
        },
      },
    },
  });

  if (!university) {
    throw new NotFoundError('University not found');
  }

  // Format nearby properties with distance info
  const nearbyProperties = university.properties.map((up: any) => ({
    ...up.property,
    distance_km: up.distance_km,
    transit_minutes: up.transit_minutes,
    primary_photo_url: up.property.photos[0]?.photo_url || null,
  }));

  // Remove the nested photos array since we've extracted it
  const formattedProperties = nearbyProperties.map(({ photos, ...rest }: any) => rest);

  return {
    id: university.id,
    name: university.name,
    city: university.city,
    country: university.country,
    latitude: university.latitude,
    longitude: university.longitude,
    created_at: university.created_at,
    property_count: (university._count as any).properties,
    nearby_properties: formattedProperties,
  };
};
