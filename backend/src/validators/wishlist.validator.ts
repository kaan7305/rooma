import { z } from 'zod';

/**
 * POST /api/wishlists
 * Create new wishlist
 */
export const createWishlistSchema = z.object({
  name: z.string().min(1, 'Wishlist name is required').max(255).trim(),
});

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>;

/**
 * PATCH /api/wishlists/:id
 * Update wishlist name
 */
export const updateWishlistSchema = z.object({
  name: z.string().min(1, 'Wishlist name is required').max(255).trim(),
});

export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>;

/**
 * POST /api/wishlists/:id/items
 * Add property to wishlist
 */
export const addToWishlistSchema = z.object({
  property_id: z.string().uuid('Invalid property ID'),
});

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
