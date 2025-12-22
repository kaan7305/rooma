import supabase from '../config/supabase';
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
  const { data: wishlist, error: createError } = await supabase
    .from('wishlists')
    .insert({
      user_id: userId,
      name: data.name,
    })
    .select()
    .single();

  if (createError || !wishlist) {
    throw new Error(createError?.message || 'Failed to create wishlist');
  }

  return { ...wishlist, items: [] };
};

/**
 * Get all wishlists for a user
 */
export const getUserWishlists = async (userId: string) => {
  const { data: wishlists, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Get items for each wishlist
  const wishlistsWithItems = await Promise.all(
    (wishlists || []).map(async (wishlist) => {
      const { data: items } = await supabase
        .from('wishlist_items')
        .select('property_id, added_at')
        .eq('wishlist_id', wishlist.id)
        .order('added_at', { ascending: false });

      // Get property details for each item
      const itemsWithProperties = await Promise.all(
        (items || []).map(async (item) => {
          const { data: property } = await supabase
            .from('properties')
            .select('id, title, city, country, monthly_price_cents, status')
            .eq('id', item.property_id)
            .single();

          if (!property) return null;

          // Get first photo
          const { data: photos } = await supabase
            .from('property_photos')
            .select('photo_url')
            .eq('property_id', property.id)
            .order('display_order', { ascending: true })
            .limit(1);

          return {
            ...item,
            property: {
              ...property,
              photos: photos || [],
            },
          };
        })
      );

      return {
        ...wishlist,
        items: itemsWithProperties.filter(i => i !== null),
        item_count: itemsWithProperties.filter(i => i !== null).length,
      };
    })
  );

  return wishlistsWithItems;
};

/**
 * Get wishlist by ID
 */
export const getWishlistById = async (wishlistId: string, userId: string) => {
  const { data: wishlist, error: wishlistError } = await supabase
    .from('wishlists')
    .select('*')
    .eq('id', wishlistId)
    .single();

  if (wishlistError || !wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  // Only the owner can view the wishlist
  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this wishlist');
  }

  // Get items
  const { data: items } = await supabase
    .from('wishlist_items')
    .select('property_id, added_at')
    .eq('wishlist_id', wishlistId)
    .order('added_at', { ascending: false });

  // Get property details for each item
  const itemsWithProperties = await Promise.all(
    (items || []).map(async (item) => {
      const { data: property } = await supabase
        .from('properties')
        .select('id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, monthly_price_cents, status, host_id')
        .eq('id', item.property_id)
        .single();

      if (!property) return null;

      // Get photos
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', property.id)
        .order('display_order', { ascending: true })
        .limit(3);

      // Get host
      const { data: host } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo_url')
        .eq('id', property.host_id)
        .single();

      return {
        ...item,
        property: {
          ...property,
          photos: photos || [],
          host: host || null,
        },
      };
    })
  );

  return {
    ...wishlist,
    items: itemsWithProperties.filter(i => i !== null),
    item_count: itemsWithProperties.filter(i => i !== null).length,
  };
};

/**
 * Update wishlist name
 */
export const updateWishlist = async (wishlistId: string, userId: string, data: UpdateWishlistInput) => {
  const { data: wishlist, error: wishlistError } = await supabase
    .from('wishlists')
    .select('id, user_id')
    .eq('id', wishlistId)
    .single();

  if (wishlistError || !wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only update your own wishlists');
  }

  const { data: updatedWishlist, error: updateError } = await supabase
    .from('wishlists')
    .update({ name: data.name })
    .eq('id', wishlistId)
    .select()
    .single();

  if (updateError || !updatedWishlist) {
    throw new Error(updateError?.message || 'Failed to update wishlist');
  }

  // Get items
  const { data: items } = await supabase
    .from('wishlist_items')
    .select('property_id, added_at')
    .eq('wishlist_id', wishlistId)
    .order('added_at', { ascending: false });

  // Get property details
  const itemsWithProperties = await Promise.all(
    (items || []).map(async (item) => {
      const { data: property } = await supabase
        .from('properties')
        .select('id, title, city, country, monthly_price_cents')
        .eq('id', item.property_id)
        .single();

      if (!property) return null;

      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', property.id)
        .order('display_order', { ascending: true })
        .limit(1);

      return {
        ...item,
        property: {
          ...property,
          photos: photos || [],
        },
      };
    })
  );

  return {
    ...updatedWishlist,
    items: itemsWithProperties.filter(i => i !== null),
  };
};

/**
 * Delete wishlist
 */
export const deleteWishlist = async (wishlistId: string, userId: string) => {
  const { data: wishlist, error: wishlistError } = await supabase
    .from('wishlists')
    .select('id, user_id')
    .eq('id', wishlistId)
    .single();

  if (wishlistError || !wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only delete your own wishlists');
  }

  await supabase
    .from('wishlists')
    .delete()
    .eq('id', wishlistId);

  return { message: 'Wishlist deleted successfully' };
};

/**
 * Add property to wishlist
 */
export const addToWishlist = async (wishlistId: string, userId: string, data: AddToWishlistInput) => {
  // Verify wishlist exists and belongs to user
  const { data: wishlist, error: wishlistError } = await supabase
    .from('wishlists')
    .select('id, user_id')
    .eq('id', wishlistId)
    .single();

  if (wishlistError || !wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only add to your own wishlists');
  }

  // Verify property exists
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id, status')
    .eq('id', data.property_id)
    .single();

  if (propertyError || !property) {
    throw new NotFoundError('Property not found');
  }

  // Check if property already in wishlist
  const { data: existingItem } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('wishlist_id', wishlistId)
    .eq('property_id', data.property_id)
    .maybeSingle();

  if (existingItem) {
    throw new BadRequestError('Property already in wishlist');
  }

  // Add property to wishlist
  const { data: wishlistItem, error: createError } = await supabase
    .from('wishlist_items')
    .insert({
      wishlist_id: wishlistId,
      property_id: data.property_id,
    })
    .select()
    .single();

  if (createError || !wishlistItem) {
    throw new Error(createError?.message || 'Failed to add property to wishlist');
  }

  // Get property details
  const { data: propertyDetails } = await supabase
    .from('properties')
    .select('id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, monthly_price_cents, status')
    .eq('id', data.property_id)
    .single();

  // Get photos
  const { data: photos } = await supabase
    .from('property_photos')
    .select('photo_url')
    .eq('property_id', data.property_id)
    .order('display_order', { ascending: true })
    .limit(3);

  return {
    ...wishlistItem,
    property: propertyDetails ? {
      ...propertyDetails,
      photos: photos || [],
    } : null,
  };
};

/**
 * Remove property from wishlist
 */
export const removeFromWishlist = async (wishlistId: string, propertyId: string, userId: string) => {
  // Verify wishlist exists and belongs to user
  const { data: wishlist, error: wishlistError } = await supabase
    .from('wishlists')
    .select('id, user_id')
    .eq('id', wishlistId)
    .single();

  if (wishlistError || !wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only remove from your own wishlists');
  }

  // Check if item exists
  const { data: item, error: itemError } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('wishlist_id', wishlistId)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (itemError || !item) {
    throw new NotFoundError('Property not found in wishlist');
  }

  // Remove from wishlist
  await supabase
    .from('wishlist_items')
    .delete()
    .eq('wishlist_id', wishlistId)
    .eq('property_id', propertyId);

  return { message: 'Property removed from wishlist' };
};

/**
 * Check if property is in any of user's wishlists
 */
export const isPropertyWishlisted = async (userId: string, propertyId: string) => {
  // Get user's wishlists
  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId);

  if (!wishlists || wishlists.length === 0) {
    return { is_wishlisted: false, wishlist_id: null };
  }

  const wishlistIds = wishlists.map(w => w.id);

  // Check if property is in any of user's wishlists
  const { data: wishlistItem } = await supabase
    .from('wishlist_items')
    .select('wishlist_id')
    .eq('property_id', propertyId)
    .in('wishlist_id', wishlistIds)
    .maybeSingle();

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
  const { data: existingWishlists } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1);

  // Create if doesn't exist
  if (!existingWishlists || existingWishlists.length === 0) {
    const { data: wishlist, error: createError } = await supabase
      .from('wishlists')
      .insert({
        user_id: userId,
        name: 'My Wishlist',
      })
      .select()
      .single();

    if (createError || !wishlist) {
      throw new Error(createError?.message || 'Failed to create default wishlist');
    }

    return wishlist;
  }

  return existingWishlists[0];
};
