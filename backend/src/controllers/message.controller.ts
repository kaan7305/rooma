import { Request, Response, NextFunction } from 'express';
import * as messageService from '../services/message.service';
import { UnauthorizedError } from '../utils/errors';
import type {
  CreateConversationInput,
  SendMessageInput,
  GetMessagesInput,
} from '../validators/message.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * POST /api/conversations
 * Create or get existing conversation
 */
export const createConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: CreateConversationInput = req.body;

    const conversation = await messageService.createOrGetConversation(userId, data);

    res.status(201).json({
      message: 'Conversation created successfully',
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/conversations
 * Get all user's conversations
 */
export const getUserConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);

    const conversations = await messageService.getUserConversations(userId);

    res.status(200).json({
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/conversations/:id
 * Get conversation by ID
 */
export const getConversationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const conversation = await messageService.getConversationById(id, userId);

    res.status(200).json({
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/conversations/:id/messages
 * Send a message in a conversation
 */
export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const data: SendMessageInput = req.body;

    const message = await messageService.sendMessage(id, userId, data);

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/conversations/:id/messages
 * Get messages in a conversation
 */
export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const filters: GetMessagesInput = req.query as any;

    const result = await messageService.getMessages(id, userId, filters);

    res.status(200).json({
      data: result.messages,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/conversations/:id/read
 * Mark all messages in conversation as read
 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const result = await messageService.markConversationAsRead(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
