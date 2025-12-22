import prisma from '../config/database';
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
  const otherUser = await prisma.user.findUnique({
    where: { id: participant_id },
    select: { id: true },
  });

  if (!otherUser) {
    throw new NotFoundError('User not found');
  }

  // Verify property exists if provided
  if (property_id) {
    const property = await prisma.property.findUnique({
      where: { id: property_id },
      select: { id: true },
    });

    if (!property) {
      throw new NotFoundError('Property not found');
    }
  }

  // Verify booking exists if provided
  if (booking_id) {
    const booking = await prisma.booking.findUnique({
      where: { id: booking_id },
      select: { id: true, guest_id: true, property: { select: { host_id: true } } },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (!booking.property) {
      throw new NotFoundError('Booking property not found');
    }

    // Verify user is part of the booking (either guest or host)
    if (booking.guest_id !== userId && booking.property.host_id !== userId) {
      throw new ForbiddenError('You are not authorized to create a conversation for this booking');
    }
  }

  // Ensure consistent ordering for participant IDs (smaller UUID first)
  const [part1, part2] = [userId, participant_id].sort();

  // Try to find existing conversation
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      participant_1_id: part1,
      participant_2_id: part2,
      property_id: property_id || null,
    },
    include: {
      participant_1: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      participant_2: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          photos: {
            take: 1,
            orderBy: { display_order: 'asc' },
            select: { photo_url: true },
          },
        },
      },
      messages: {
        orderBy: { created_at: 'desc' },
        take: 1,
      },
    },
  });

  if (existingConversation) {
    // Return existing conversation with unread count
    const unreadCount = await prisma.message.count({
      where: {
        conversation_id: existingConversation.id,
        recipient_id: userId,
        read_at: null,
      },
    });

    return {
      ...existingConversation,
      unread_count: unreadCount,
    };
  }

  // Create new conversation
  const newConversation = await prisma.conversation.create({
    data: {
      participant_1_id: part1,
      participant_2_id: part2,
      property_id: property_id || null,
      booking_id: booking_id || null,
    },
    include: {
      participant_1: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      participant_2: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          photos: {
            take: 1,
            orderBy: { display_order: 'asc' },
            select: { photo_url: true },
          },
        },
      },
    },
  });

  return {
    ...newConversation,
    unread_count: 0,
    messages: [],
  };
};

/**
 * Get all conversations for a user
 * GET /api/conversations
 */
export const getUserConversations = async (userId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participant_1_id: userId }, { participant_2_id: userId }],
    },
    orderBy: { last_message_at: 'desc' },
    include: {
      participant_1: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      participant_2: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          photos: {
            take: 1,
            orderBy: { display_order: 'asc' },
            select: { photo_url: true },
          },
        },
      },
      messages: {
        orderBy: { created_at: 'desc' },
        take: 1,
      },
    },
  });

  // Add unread count and other participant info for each conversation
  const conversationsWithDetails = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversation_id: conv.id,
          recipient_id: userId,
          read_at: null,
        },
      });

      // Determine the other participant
      const otherParticipant =
        conv.participant_1?.id === userId ? conv.participant_2 : conv.participant_1;

      return {
        ...conv,
        unread_count: unreadCount,
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
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participant_1: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      participant_2: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          photos: {
            take: 1,
            orderBy: { display_order: 'asc' },
            select: { photo_url: true },
          },
        },
      },
    },
  });

  if (!conversation) {
    throw new NotFoundError('Conversation not found');
  }

  // Verify user is a participant
  if (conversation.participant_1_id !== userId && conversation.participant_2_id !== userId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  const unreadCount = await prisma.message.count({
    where: {
      conversation_id: conversationId,
      recipient_id: userId,
      read_at: null,
    },
  });

  const otherParticipant =
    conversation.participant_1?.id === userId ? conversation.participant_2 : conversation.participant_1;

  return {
    ...conversation,
    unread_count: unreadCount,
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
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      participant_1_id: true,
      participant_2_id: true,
    },
  });

  if (!conversation) {
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
  const message = await prisma.message.create({
    data: {
      conversation_id: conversationId,
      sender_id: userId,
      recipient_id: recipientId,
      message_text: data.message_text,
    },
    include: {
      sender: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
      recipient: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
    },
  });

  // Update conversation's last_message_at
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { last_message_at: new Date() },
  });

  return message;
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
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      participant_1_id: true,
      participant_2_id: true,
    },
  });

  if (!conversation) {
    throw new NotFoundError('Conversation not found');
  }

  if (conversation.participant_1_id !== userId && conversation.participant_2_id !== userId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  const { page, limit, before_id } = filters;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    conversation_id: conversationId,
  };

  // If before_id is provided, get messages before that message (for infinite scroll)
  if (before_id) {
    const beforeMessage = await prisma.message.findUnique({
      where: { id: before_id },
      select: { created_at: true },
    });

    if (beforeMessage) {
      where.created_at = { lt: beforeMessage.created_at };
    }
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_photo_url: true,
          },
        },
        recipient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_photo_url: true,
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);

  return {
    messages,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Mark all messages in a conversation as read
 * PATCH /api/conversations/:id/read
 */
export const markConversationAsRead = async (conversationId: string, userId: string) => {
  // Verify conversation exists and user is a participant
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      participant_1_id: true,
      participant_2_id: true,
    },
  });

  if (!conversation) {
    throw new NotFoundError('Conversation not found');
  }

  if (conversation.participant_1_id !== userId && conversation.participant_2_id !== userId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  // Mark all unread messages where user is the recipient as read
  const result = await prisma.message.updateMany({
    where: {
      conversation_id: conversationId,
      recipient_id: userId,
      read_at: null,
    },
    data: {
      read_at: new Date(),
    },
  });

  return {
    message: 'Messages marked as read',
    count: result.count,
  };
};
