import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  createWishlistSchema,
  updateWishlistSchema,
  addToWishlistSchema,
} from '../validators/wishlist.validator';

const router = Router();

/**
 * @route   POST /api/wishlists
 * @desc    Create new wishlist
 * @access  Private
 */
router.post('/', requireAuth, validate(createWishlistSchema), wishlistController.createWishlist);

/**
 * @route   GET /api/wishlists
 * @desc    Get all user's wishlists
 * @access  Private
 */
router.get('/', requireAuth, wishlistController.getUserWishlists);

/**
 * @route   GET /api/wishlists/check/:propertyId
 * @desc    Check if property is wishlisted
 * @access  Private
 */
router.get('/check/:propertyId', requireAuth, wishlistController.checkIfWishlisted);

/**
 * @route   GET /api/wishlists/:id
 * @desc    Get wishlist by ID
 * @access  Private
 */
router.get('/:id', requireAuth, wishlistController.getWishlistById);

/**
 * @route   PATCH /api/wishlists/:id
 * @desc    Update wishlist name
 * @access  Private
 */
router.patch('/:id', requireAuth, validate(updateWishlistSchema), wishlistController.updateWishlist);

/**
 * @route   DELETE /api/wishlists/:id
 * @desc    Delete wishlist
 * @access  Private
 */
router.delete('/:id', requireAuth, wishlistController.deleteWishlist);

/**
 * @route   POST /api/wishlists/:id/items
 * @desc    Add property to wishlist
 * @access  Private
 */
router.post('/:id/items', requireAuth, validate(addToWishlistSchema), wishlistController.addToWishlist);

/**
 * @route   DELETE /api/wishlists/:id/items/:propertyId
 * @desc    Remove property from wishlist
 * @access  Private
 */
router.delete('/:id/items/:propertyId', requireAuth, wishlistController.removeFromWishlist);

export default router;
