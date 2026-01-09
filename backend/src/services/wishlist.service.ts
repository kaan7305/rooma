import supabase from '../config/supabase';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import type {
  CreateWishlistInput,
  UpdateWishlistInput,
  AddToWishlistInput,
} from '../validators/wishlist.validator';
import type { 
  WishlistRow, WishlistInsert, WishlistUpdate, WishlistItemInsert,
  WishlistItemRow, PropertyRow, PropertyPhotoRow, UserRow
} from '../types/supabase-helpers';

/**
 * Create new wishlist
 */
export const createWishlist = async (userId: string, data: CreateWishlistInput) => {
  const wishlistData: WishlistInsert = {
      user_id: userId,
      name: data.name,
  };

  const { data: wishlist, error: createError } = await supabase
    .from('wishlists')
    .insert(wishlistData as any)
    .select()
    .single() as { data: WishlistRow | null; error: any };

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
    .order('created_at', { ascending: false }) as { data: WishlistRow[] | null; error: any };

  if (error) {
    throw new Error(error.message);
  }

  // Get items for each wishlist
  const wishlistsWithItems = await Promise.all(
    (wishlists || []).map(async (wishlist) => {
      const { data: items } = await supabase
        .from('wishlist_items')
        .select('property_id, added_at')
        .eq('wishlist_id', wishlist.id || '')
        .order('added_at', { ascending: false }) as { data: Array<Pick<WishlistItemRow, 'property_id' | 'added_at'>> | null; error: any };

      // Get property details for each item
      const itemsWithProperties = await Promise.all(
        (items || []).map(async (item) => {
          const { data: property } = await supabase
            .from('properties')
            .select('id, title, city, country, monthly_price_cents, status')
            .eq('id', item.property_id || '')
            .single() as { data: Pick<PropertyRow, 'id' | 'title' | 'city' | 'country' | 'monthly_price_cents' | 'status'> | null; error: any };

          if (!property) return null;

          // Get first photo
          const { data: photos } = await supabase
            .from('property_photos')
            .select('photo_url')
            .eq('property_id', property.id || '')
            .order('display_order', { ascending: true })
            .limit(1) as { data: Array<Pick<PropertyPhotoRow, 'photo_url'>> | null; error: any };

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
    .single() as { data: WishlistRow | null; error: any };

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
    .order('added_at', { ascending: false }) as { data: Array<Pick<WishlistItemRow, 'property_id' | 'added_at'>> | null; error: any };

  // Get property details for each item
  const itemsWithProperties = await Promise.all(
    (items || []).map(async (item) => {
      const { data: property } = await supabase
        .from('properties')
        .select('id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, monthly_price_cents, status, host_id')
        .eq('id', item.property_id || '')
        .single() as { data: Pick<PropertyRow, 'id' | 'title' | 'description' | 'property_type' | 'city' | 'country' | 'bedrooms' | 'bathrooms' | 'max_guests' | 'monthly_price_cents' | 'status' | 'host_id'> | null; error: any };

      if (!property) return null;

      // Get photos
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', property.id || '')
        .order('display_order', { ascending: true })
        .limit(3) as { data: Array<Pick<PropertyPhotoRow, 'photo_url'>> | null; error: any };

      // Get host
      const { data: host } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo_url')
        .eq('id', property.host_id || '')
        .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url'> | null; error: any };

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
    .single() as { data: Pick<WishlistRow, 'id' | 'user_id'> | null; error: any };

  if (wishlistError || !wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  if (wishlist.user_id !== userId) {
    throw new ForbiddenError('You can only update your own wishlists');
  }

  const updateData: WishlistUpdate = { name: data.name };
  const { data: updatedWishlist, error: updateError } = await supabase
    .from('wishlists')
    // @ts-expect-error - Supabase type inference issue with update()
    .update(updateData as any)
    .eq('id', wishlistId)
    .select()
    .single() as { data: WishlistRow | null; error: any };

  if (updateError || !updatedWishlist) {
    throw new Error(updateError?.message || 'Failed to update wishlist');
  }

  // Get items
  const { data: items } = await supabase
    .from('wishlist_items')
    .select('property_id, added_at')
    .eq('wishlist_id', wishlistId)
    .order('added_at', { ascending: false }) as { data: Array<Pick<WishlistItemRow, 'property_id' | 'added_at'>> | null; error: any };

  // Get property details
  const itemsWithProperties = await Promise.all(
    (items || []).map(async (item) => {
      const { data: property } = await supabase
        .from('properties')
        .select('id, title, city, country, monthly_price_cents')
        .eq('id', item.property_id || '')
        .single() as { data: Pick<PropertyRow, 'id' | 'title' | 'city' | 'country' | 'monthly_price_cents'> | null; error: any };

      if (!property) return null;

      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', property.id || '')
        .order('display_order', { ascending: true })
        .limit(1) as { data: Array<Pick<PropertyPhotoRow, 'photo_url'>> | null; error: any };

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
    .single() as { data: Pick<WishlistRow, 'id' | 'user_id'> | null; error: any };

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
    .single() as { data: Pick<WishlistRow, 'id' | 'user_id'> | null; error: any };

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
    .single() as { data: Pick<PropertyRow, 'id' | 'status'> | null; error: any };

  if (propertyError || !property) {
    throw new NotFoundError('Property not found');
  }

  // Check if property already in wishlist
  const { data: existingItem } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('wishlist_id', wishlistId)
    .eq('property_id', data.property_id)
    .maybeSingle() as { data: WishlistItemRow | null; error: any };

  if (existingItem) {
    throw new BadRequestError('Property already in wishlist');
  }

  // Add property to wishlist
  const itemData: WishlistItemInsert = {
      wishlist_id: wishlistId,
      property_id: data.property_id,
  };

  const { data: wishlistItem, error: createError } = await supabase
    .from('wishlist_items')
    .insert(itemData as any)
    .select()
    .single() as { data: WishlistItemRow | null; error: any };

  if (createError || !wishlistItem) {
    throw new Error(createError?.message || 'Failed to add property to wishlist');
  }

  // Get property details
  const { data: propertyDetails } = await supabase
    .from('properties')
    .select('id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, monthly_price_cents, status')
    .eq('id', data.property_id)
    .single() as { data: Pick<PropertyRow, 'id' | 'title' | 'description' | 'property_type' | 'city' | 'country' | 'bedrooms' | 'bathrooms' | 'max_guests' | 'monthly_price_cents' | 'status'> | null; error: any };

  // Get photos
  const { data: photos } = await supabase
    .from('property_photos')
    .select('photo_url')
    .eq('property_id', data.property_id)
    .order('display_order', { ascending: true })
    .limit(3) as { data: Array<Pick<PropertyPhotoRow, 'photo_url'>> | null; error: any };

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
    .single() as { data: Pick<WishlistRow, 'id' | 'user_id'> | null; error: any };

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
    .maybeSingle() as { data: WishlistItemRow | null; error: any };

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
    .eq('user_id', userId) as { data: Array<Pick<WishlistRow, 'id'>> | null; error: any };

  if (!wishlists || wishlists.length === 0) {
    return { is_wishlisted: false, wishlist_id: null };
  }

  const wishlistIds = wishlists.map(w => w.id || '').filter(id => id);

  // Check if property is in any of user's wishlists
  const { data: wishlistItem } = await supabase
    .from('wishlist_items')
    .select('wishlist_id')
    .eq('property_id', propertyId)
    .in('wishlist_id', wishlistIds)
    .maybeSingle() as { data: Pick<WishlistItemRow, 'wishlist_id'> | null; error: any };

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
    .limit(1) as { data: WishlistRow[] | null; error: any };

  // Create if doesn't exist
  if (!existingWishlists || existingWishlists.length === 0) {
    const wishlistData: WishlistInsert = {
        user_id: userId,
        name: 'My Wishlist',
    };

    const { data: wishlist, error: createError } = await supabase
      .from('wishlists')
      .insert(wishlistData as any)
      .select()
      .single() as { data: WishlistRow | null; error: any };

    if (createError || !wishlist) {
      throw new Error(createError?.message || 'Failed to create default wishlist');
  }

  return wishlist;
  }

  return existingWishlists[0];
};
