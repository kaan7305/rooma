import prisma from '../config/database';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import type {
  CreateWishlistInput,
  UpdateWishlistInput,
  AddToWishlistInput,
} from '../validators/wishlist.validator';

/**
 * Create new wishlist
 */
export const createWishlist = async (userId: string, data: CreateWishlistInput) => {
  const wishlist = await prisma.wishlist.create({
    data: {
      user_id: userId,
      name: data.name,
    },
    include: {
      items: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              country: true,
              monthly_price_cents: true,
              photos: {
                take: 1,
                orderBy: { display_order: 'asc' },
                select: { photo_url: true },
              },
            },
          },
        },
      },
    },
  });

  return wishlist;
};

/**
 * Get all wishlists for a user
 */
export const getUserWishlists = async (userId: string) => {
  const wishlists = await prisma.wishlist.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    include: {
      items: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              country: true,
              monthly_price_cents: true,
              status: true,
              photos: {
                take: 1,
                orderBy: { display_order: 'asc' },
                select: { photo_url: true },
              },
            },
          },
        },
        orderBy: { added_at: 'desc' },
      },
    },
  });

  // Add item count to each wishlist
  const wishlistsWithCount = wishlists.map((wishlist) => ({
    ...wishlist,
    item_count: wishlist.items.length,
  }));

  return wishlistsWithCount;
};

/**
 * Get wishlist by ID
 */
export const getWishlistById = async (wishlistId: string, userId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    include: {
      items: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              description: true,
              property_type: true,
              city: true,
              country: true,
              bedrooms: true,
              bathrooms: true,
              max_guests: true,
              monthly_price_cents: true,
              status: true,
              photos: {
                take: 3,
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
        orderBy: { added_at: 'desc' },
      },
    },
  });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  // Only the owner can view the wishlist
  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this wishlist');
  }

  return {
    ...wishlist,
    item_count: wishlist.items.length,
  };
};

/**
 * Update wishlist name
 */
export const updateWishlist = async (wishlistId: string, userId: string, data: UpdateWishlistInput) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { id: true, user_id: true },
  });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only update your own wishlists');
  }

  const updatedWishlist = await prisma.wishlist.update({
    where: { id: wishlistId },
    data: {
      name: data.name,
    },
    include: {
      items: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              country: true,
              monthly_price_cents: true,
              photos: {
                take: 1,
                orderBy: { display_order: 'asc' },
                select: { photo_url: true },
              },
            },
          },
        },
      },
    },
  });

  return updatedWishlist;
};

/**
 * Delete wishlist
 */
export const deleteWishlist = async (wishlistId: string, userId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { id: true, user_id: true },
  });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only delete your own wishlists');
  }

  await prisma.wishlist.delete({
    where: { id: wishlistId },
  });

  return { message: 'Wishlist deleted successfully' };
};

/**
 * Add property to wishlist
 */
export const addToWishlist = async (wishlistId: string, userId: string, data: AddToWishlistInput) => {
  // Verify wishlist exists and belongs to user
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { id: true, user_id: true },
  });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only add to your own wishlists');
  }

  // Verify property exists
  const property = await prisma.property.findUnique({
    where: { id: data.property_id },
    select: { id: true, status: true },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  // Check if property already in wishlist
  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      wishlist_id_property_id: {
        wishlist_id: wishlistId,
        property_id: data.property_id,
      },
    },
  });

  if (existingItem) {
    throw new BadRequestError('Property already in wishlist');
  }

  // Add property to wishlist
  const wishlistItem = await prisma.wishlistItem.create({
    data: {
      wishlist_id: wishlistId,
      property_id: data.property_id,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          description: true,
          property_type: true,
          city: true,
          country: true,
          bedrooms: true,
          bathrooms: true,
          max_guests: true,
          monthly_price_cents: true,
          status: true,
          photos: {
            take: 3,
            orderBy: { display_order: 'asc' },
            select: { photo_url: true },
          },
        },
      },
    },
  });

  return wishlistItem;
};

/**
 * Remove property from wishlist
 */
export const removeFromWishlist = async (wishlistId: string, propertyId: string, userId: string) => {
  // Verify wishlist exists and belongs to user
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { id: true, user_id: true },
  });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only remove from your own wishlists');
  }

  // Check if item exists
  const item = await prisma.wishlistItem.findUnique({
    where: {
      wishlist_id_property_id: {
        wishlist_id: wishlistId,
        property_id: propertyId,
      },
    },
  });

  if (!item) {
    throw new NotFoundError('Property not found in wishlist');
  }

  // Remove from wishlist
  await prisma.wishlistItem.delete({
    where: {
      wishlist_id_property_id: {
        wishlist_id: wishlistId,
        property_id: propertyId,
      },
    },
  });

  return { message: 'Property removed from wishlist' };
};

/**
 * Check if property is in any of user's wishlists
 */
export const isPropertyWishlisted = async (userId: string, propertyId: string) => {
  const wishlistItem = await prisma.wishlistItem.findFirst({
    where: {
      property_id: propertyId,
      wishlist: {
        user_id: userId,
      },
    },
    select: {
      wishlist_id: true,
    },
  });

  return {
    is_wishlisted: !!wishlistItem,
    wishlist_id: wishlistItem?.wishlist_id || null,
  };
};

/**
 * Get default wishlist (create if doesn't exist)
 */
export const getOrCreateDefaultWishlist = async (userId: string) => {
  // Try to find existing default wishlist
  let wishlist = await prisma.wishlist.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: 'asc' }, // Get the oldest one (likely the default)
  });

  // Create if doesn't exist
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: {
        user_id: userId,
        name: 'My Wishlist',
      },
    });
  }

  return wishlist;
};
