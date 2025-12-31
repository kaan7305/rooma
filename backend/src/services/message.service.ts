import supabase from '../config/supabase';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import type {
  CreateConversationInput,
  SendMessageInput,
  GetMessagesInput,
} from '../validators/message.validator';

/**
 * Create or get existing conversation
 * POST /api/conversations
 */
export const createOrGetConversation = async (userId: string, data: CreateConversationInput) => {
  const { participant_id, property_id, booking_id } = data;

  // Cannot create conversation with yourself
  if (participant_id === userId) {
    throw new BadRequestError('Cannot create conversation with yourself');
  }

  // Verify other participant exists
  const { data: otherUser, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', participant_id)
    .single();

  if (userError || !otherUser) {
    throw new NotFoundError('User not found');
  }

  // Verify property exists if provided
  if (property_id) {
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', property_id)
      .single();

    if (propertyError || !property) {
      throw new NotFoundError('Property not found');
    }
  }

  // Verify booking exists if provided
  if (booking_id) {
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, guest_id, property_id')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      throw new NotFoundError('Booking not found');
    }

    // Get property to check host_id
    const { data: property } = await supabase
      .from('properties')
      .select('host_id')
      .eq('id', booking.property_id)
      .single();

    if (!property) {
      throw new NotFoundError('Booking property not found');
    }

    // Verify user is part of the booking (either guest or host)
    if (booking.guest_id !== userId && property.host_id !== userId) {
      throw new ForbiddenError('You are not authorized to create a conversation for this booking');
    }
  }

  // Ensure consistent ordering for participant IDs (smaller UUID first)
  const [part1, part2] = [userId, participant_id].sort();

  // Try to find existing conversation
  let query = supabase
    .from('conversations')
    .select('*')
    .eq('participant_1_id', part1)
    .eq('participant_2_id', part2);

  if (property_id) {
    query = query.eq('property_id', property_id);
  } else {
    query = query.is('property_id', null);
  }

  const { data: existingConversations } = await query.limit(1);

  if (existingConversations && existingConversations.length > 0) {
    const existingConversation = existingConversations[0];

    // Get participants
    const [participant1, participant2] = await Promise.all([
      supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', existingConversation.participant_1_id).single(),
      supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', existingConversation.participant_2_id).single(),
    ]);

    // Get property if exists
    let property = null;
    if (existingConversation.property_id) {
      const { data: propData } = await supabase
        .from('properties')
        .select('id, title, city, country')
        .eq('id', existingConversation.property_id)
        .single();

      if (propData) {
        const { data: photos } = await supabase
          .from('property_photos')
          .select('photo_url')
          .eq('property_id', propData.id)
          .order('display_order', { ascending: true })
          .limit(1);
        property = { ...propData, photos: photos || [] };
      }
    }

    // Get last message
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', existingConversation.id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', existingConversation.id)
      .eq('recipient_id', userId)
      .is('read_at', null);

    return {
      ...existingConversation,
      participant_1: participant1.data || null,
      participant_2: participant2.data || null,
      property: property,
      messages: messages || [],
      unread_count: unreadCount || 0,
    };
  }

  // Create new conversation
  const { data: newConversation, error: createError } = await supabase
    .from('conversations')
    .insert({
      participant_1_id: part1,
      participant_2_id: part2,
      property_id: property_id || null,
      booking_id: booking_id || null,
    })
    .select()
    .single();

  if (createError || !newConversation) {
    throw new Error(createError?.message || 'Failed to create conversation');
  }

  // Get participants
  const [participant1, participant2] = await Promise.all([
    supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', part1).single(),
    supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', part2).single(),
  ]);

  // Get property if exists
  let property = null;
  if (newConversation.property_id) {
    const { data: propData } = await supabase
      .from('properties')
      .select('id, title, city, country')
      .eq('id', newConversation.property_id)
      .single();

    if (propData) {
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', propData.id)
        .order('display_order', { ascending: true })
        .limit(1);
      property = { ...propData, photos: photos || [] };
    }
  }

  return {
    ...newConversation,
    participant_1: participant1.data || null,
    participant_2: participant2.data || null,
    property: property,
    unread_count: 0,
    messages: [],
  };
};

/**
 * Get all conversations for a user
 * GET /api/conversations
 */
export const getUserConversations = async (userId: string) => {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Add unread count and other participant info for each conversation
  const conversationsWithDetails = await Promise.all(
    (conversations || []).map(async (conv) => {
      // Get participants
      const [participant1, participant2] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', conv.participant_1_id).single(),
        supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', conv.participant_2_id).single(),
      ]);

      // Get property if exists
      let property = null;
      if (conv.property_id) {
        const { data: propData } = await supabase
          .from('properties')
          .select('id, title, city, country')
          .eq('id', conv.property_id)
          .single();

        if (propData) {
          const { data: photos } = await supabase
            .from('property_photos')
            .select('photo_url')
            .eq('property_id', propData.id)
            .order('display_order', { ascending: true })
            .limit(1);
          property = { ...propData, photos: photos || [] };
        }
      }

      // Get last message
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Get unread count
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('recipient_id', userId)
        .is('read_at', null);

      // Determine the other participant
      const otherParticipant =
        participant1.data?.id === userId ? participant2.data : participant1.data;

      return {
        ...conv,
        participant_1: participant1.data || null,
        participant_2: participant2.data || null,
        property: property,
        messages: messages || [],
        unread_count: unreadCount || 0,
        other_participant: otherParticipant,
      };
    })
  );

  return conversationsWithDetails;
};

/**
 * Get conversation by ID
 * GET /api/conversations/:id
 */
export const getConversationById = async (conversationId: string, userId: string) => {
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError || !conversation) {
    throw new NotFoundError('Conversation not found');
  }

  // Verify user is a participant
  if (conversation.participant_1_id !== userId && conversation.participant_2_id !== userId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  // Get participants
  const [participant1, participant2] = await Promise.all([
    supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', conversation.participant_1_id).single(),
    supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', conversation.participant_2_id).single(),
  ]);

  // Get property if exists
  let property = null;
  if (conversation.property_id) {
    const { data: propData } = await supabase
      .from('properties')
      .select('id, title, city, country')
      .eq('id', conversation.property_id)
      .single();

    if (propData) {
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', propData.id)
        .order('display_order', { ascending: true })
        .limit(1);
      property = { ...propData, photos: photos || [] };
    }
  }

  // Get unread count
  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .eq('recipient_id', userId)
    .is('read_at', null);

  const otherParticipant =
    participant1.data?.id === userId ? participant2.data : participant1.data;

  return {
    ...conversation,
    participant_1: participant1.data || null,
    participant_2: participant2.data || null,
    property: property,
    unread_count: unreadCount || 0,
    other_participant: otherParticipant,
  };
};

/**
 * Send a message in a conversation
 * POST /api/conversations/:id/messages
 */
export const sendMessage = async (
  conversationId: string,
  userId: string,
  data: SendMessageInput
) => {
  // Verify conversation exists and user is a participant
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('id, participant_1_id, participant_2_id')
    .eq('id', conversationId)
    .single();

  if (convError || !conversation) {
    throw new NotFoundError('Conversation not found');
  }

  if (conversation.participant_1_id !== userId && conversation.participant_2_id !== userId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  // Determine recipient (the other participant)
  const recipientId =
    conversation.participant_1_id === userId
      ? conversation.participant_2_id
      : conversation.participant_1_id;

  // Create message
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      recipient_id: recipientId,
      message_text: data.message_text,
    })
    .select()
    .single();

  if (messageError || !message) {
    throw new Error(messageError?.message || 'Failed to create message');
  }

  // Get sender and recipient
  const [sender, recipient] = await Promise.all([
    supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', userId).single(),
    supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', recipientId).single(),
  ]);

  // Update conversation's last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return {
    ...message,
    sender: sender.data || null,
    recipient: recipient.data || null,
  };
};

/**
 * Get messages in a conversation
 * GET /api/conversations/:id/messages
 */
export const getMessages = async (
  conversationId: string,
  userId: string,
  filters: GetMessagesInput
) => {
  // Verify conversation exists and user is a participant
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('id, participant_1_id, participant_2_id')
    .eq('id', conversationId)
    .single();

  if (convError || !conversation) {
    throw new NotFoundError('Conversation not found');
  }

  if (conversation.participant_1_id !== userId && conversation.participant_2_id !== userId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  const { page, limit, before_id } = filters;
  const skip = (page - 1) * limit;
  const to = skip + limit - 1;

  // Build query
  let query = supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('conversation_id', conversationId);

  // If before_id is provided, get messages before that message (for infinite scroll)
  if (before_id) {
    const { data: beforeMessage } = await supabase
      .from('messages')
      .select('created_at')
      .eq('id', before_id)
      .single();

    if (beforeMessage) {
      query = query.lt('created_at', beforeMessage.created_at);
    }
  }

  query = query.order('created_at', { ascending: false }).range(skip, to);

  const { data: messages, error: messagesError, count } = await query;

  if (messagesError) {
    throw new Error(messagesError.message);
  }

  // Get sender and recipient for each message
  const messagesWithUsers = await Promise.all(
    (messages || []).map(async (msg) => {
      const [sender, recipient] = await Promise.all([
        msg.sender_id ? supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', msg.sender_id).single() : { data: null },
        msg.recipient_id ? supabase.from('users').select('id, first_name, last_name, profile_photo_url').eq('id', msg.recipient_id).single() : { data: null },
      ]);

      return {
        ...msg,
        sender: sender.data || null,
        recipient: recipient.data || null,
      };
    })
  );

  return {
    messages: messagesWithUsers,
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    },
  };
};

/**
 * Mark all messages in a conversation as read
 * PATCH /api/conversations/:id/read
 */
export const markConversationAsRead = async (conversationId: string, userId: string) => {
  // Verify conversation exists and user is a participant
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('id, participant_1_id, participant_2_id')
    .eq('id', conversationId)
    .single();

  if (convError || !conversation) {
    throw new NotFoundError('Conversation not found');
  }

  if (conversation.participant_1_id !== userId && conversation.participant_2_id !== userId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  // Mark all unread messages where user is the recipient as read
  const { data: updatedMessages, error: updateError } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('recipient_id', userId)
    .is('read_at', null)
    .select();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return {
    message: 'Messages marked as read',
    count: updatedMessages?.length || 0,
  };
};
