import { z } from 'zod';

/**
 * POST /api/conversations
 * Create or get existing conversation
 */
export const createConversationSchema = z.object({
  // The other participant in the conversation
  participant_id: z.string().uuid(),

  // Optional: property the conversation is about
  property_id: z.string().uuid().optional(),

  // Optional: booking the conversation is about
  booking_id: z.string().uuid().optional(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

/**
 * POST /api/conversations/:id/messages
 * Send a message in a conversation
 */
export const sendMessageSchema = z.object({
  message_text: z.string().min(1).max(5000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

/**
 * GET /api/conversations/:id/messages
 * Get messages in a conversation
 */
export const getMessagesSchema = z.object({
  // Pagination
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('50').transform(Number).pipe(z.number().int().min(1).max(100)),

  // Load messages before a specific message (for infinite scroll)
  before_id: z.string().uuid().optional(),
});

export type GetMessagesInput = z.infer<typeof getMessagesSchema>;

/**
 * PATCH /api/conversations/:id/read
 * Mark all messages in conversation as read
 */
export const markAsReadSchema = z.object({
  // No body needed, just the conversation ID from params
});

export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
