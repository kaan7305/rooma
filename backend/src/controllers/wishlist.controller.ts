import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlist.service';
import { UnauthorizedError } from '../utils/errors';
import type {
  CreateWishlistInput,
  UpdateWishlistInput,
  AddToWishlistInput,
} from '../validators/wishlist.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * POST /api/wishlists
 * Create new wishlist
 */
export const createWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: CreateWishlistInput = req.body;

    const wishlist = await wishlistService.createWishlist(userId, data);

    res.status(201).json({
      message: 'Wishlist created successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/wishlists
 * Get all user's wishlists
 */
export const getUserWishlists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);

    const wishlists = await wishlistService.getUserWishlists(userId);

    res.status(200).json({
      data: wishlists,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/wishlists/:id
 * Get wishlist by ID
 */
export const getWishlistById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const wishlist = await wishlistService.getWishlistById(id, userId);

    res.status(200).json({
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/wishlists/:id
 * Update wishlist name
 */
export const updateWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const data: UpdateWishlistInput = req.body;

    const wishlist = await wishlistService.updateWishlist(id, userId, data);

    res.status(200).json({
      message: 'Wishlist updated successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wishlists/:id
 * Delete wishlist
 */
export const deleteWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const result = await wishlistService.deleteWishlist(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/wishlists/:id/items
 * Add property to wishlist
 */
export const addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const data: AddToWishlistInput = req.body;

    const item = await wishlistService.addToWishlist(id, userId, data);

    res.status(201).json({
      message: 'Property added to wishlist',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wishlists/:id/items/:propertyId
 * Remove property from wishlist
 */
export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const propertyId = req.params.propertyId as string;

    const result = await wishlistService.removeFromWishlist(id, propertyId, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/wishlists/check/:propertyId
 * Check if property is wishlisted
 */
export const checkIfWishlisted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const propertyId = req.params.propertyId as string;

    const result = await wishlistService.isPropertyWishlisted(userId, propertyId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
