import { z } from 'zod';

/**
 * GET /api/universities
 * Search/filter universities
 */
export const searchUniversitiesSchema = z.object({
  // Search query (searches in name, city, country)
  q: z.string().min(1).optional(),

  // Location filters
  city: z.string().optional(),
  country: z.string().optional(),

  // Proximity search (requires latitude & longitude)
  latitude: z.string().transform(Number).pipe(z.number().min(-90).max(90)).optional(),
  longitude: z.string().transform(Number).pipe(z.number().min(-180).max(180)).optional(),
  radius_km: z.string().transform(Number).pipe(z.number().min(0.1).max(100)).optional(),

  // Pagination
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
});

export type SearchUniversitiesInput = z.infer<typeof searchUniversitiesSchema>;
