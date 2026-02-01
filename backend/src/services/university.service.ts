import supabase from '../config/supabase';
import { NotFoundError } from '../utils/errors';
import type { SearchUniversitiesInput } from '../validators/university.validator';
import type { 
  UniversityRow, PropertyUniversityRow, 
  PropertyRow, PropertyPhotoRow, UserRow 
} from '../types/supabase-helpers';

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
  // and then filter by distance (Supabase/Postgres geospatial can be added later)
  let universities;
  let total;

  if (latitude !== undefined && longitude !== undefined && radius_km !== undefined) {
    // Build query for universities
    let query = supabase.from('universities').select('*');

    // Apply text search filters
    if (q) {
      query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,country.ilike.%${q}%`);
    }
    if (city) {
      query = query.ilike('city', city);
    }
    if (country) {
      query = query.ilike('country', country);
    }

    const { data: allUniversitiesData } = await query as { data: UniversityRow[] | null; error: any };

    // Get property counts for each university
    const universitiesWithCounts = await Promise.all(
      (allUniversitiesData || []).map(async (uni) => {
        const { count } = await supabase
          .from('property_universities')
          .select('*', { count: 'exact', head: true })
          .eq('university_id', uni.id || '') as { count: number | null; error: any };
        return { ...uni, _count: { properties: count || 0 } };
      })
    );

    const allUniversities = universitiesWithCounts;

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
    const to = skip + limit - 1;

    // Build query
    let query = supabase.from('universities').select('*', { count: 'exact' });

    // Apply filters
    if (q) {
      query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,country.ilike.%${q}%`);
    }
    if (city) {
      query = query.ilike('city', city);
    }
    if (country) {
      query = query.ilike('country', country);
    }

    query = query.order('name', { ascending: true }).range(skip, to);

    const { data: universitiesData, count, error } = await query as { data: UniversityRow[] | null; error: any; count: number | null };

    if (error) {
      throw new Error(error.message);
    }

    // Get property counts
    const universitiesWithCounts = await Promise.all(
      (universitiesData || []).map(async (uni) => {
        const { count: propCount } = await supabase
          .from('property_universities')
          .select('*', { count: 'exact', head: true })
          .eq('university_id', uni.id || '') as { count: number | null; error: any };
        return { ...uni, _count: { properties: propCount || 0 } };
      })
    );

    total = count || 0;
    universities = universitiesWithCounts;
  }

  // Format response
  const formattedUniversities = (universities || []).map((uni) => ({
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
  const { data: university, error: uniError } = await supabase
    .from('universities')
    .select('*')
    .eq('id', universityId)
    .single() as { data: UniversityRow | null; error: any };

  if (uniError || !university) {
    throw new NotFoundError('University not found');
  }

  // Get property count
  const { count: propertyCount } = await supabase
    .from('property_universities')
    .select('*', { count: 'exact', head: true })
    .eq('university_id', universityId) as { count: number | null; error: any };

  // Get nearby properties
  const { data: propertyUniversities } = await supabase
    .from('property_universities')
    .select('property_id, distance_km, transit_minutes')
    .eq('university_id', universityId)
    .order('distance_km', { ascending: true })
    .limit(20) as { data: Array<Pick<PropertyUniversityRow, 'property_id' | 'distance_km' | 'transit_minutes'>> | null; error: any };

  // Get property details for each
  const nearbyProperties = await Promise.all(
    (propertyUniversities || []).map(async (pu) => {
      const { data: property } = await supabase
        .from('properties')
        .select('id, title, description, property_type, city, country, latitude, longitude, bedrooms, bathrooms, max_guests, monthly_price_cents, status, host_id')
        .eq('id', pu.property_id || '')
        .single() as { data: Pick<PropertyRow, 'id' | 'title' | 'description' | 'property_type' | 'city' | 'country' | 'latitude' | 'longitude' | 'bedrooms' | 'bathrooms' | 'max_guests' | 'monthly_price_cents' | 'status' | 'host_id'> | null; error: any };

      if (!property) return null;

      // Get first photo
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', property.id || '')
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle() as { data: Pick<PropertyPhotoRow, 'photo_url'> | null; error: any };

      // Get host
      const { data: host } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo_url')
        .eq('id', property.host_id || '')
        .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url'> | null; error: any };

      return {
        ...property,
        distance_km: pu.distance_km,
        transit_minutes: pu.transit_minutes,
        primary_photo_url: photos?.photo_url || null,
        host: host || null,
      };
    })
  );

  const formattedProperties = nearbyProperties.filter(p => p !== null);

  return {
    id: university.id,
    name: university.name,
    city: university.city,
    country: university.country,
    latitude: university.latitude,
    longitude: university.longitude,
    created_at: university.created_at,
    property_count: propertyCount || 0,
    nearby_properties: formattedProperties,
  };
};
