import { Router } from 'express';
import * as messageController from '../controllers/message.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  createConversationSchema,
  sendMessageSchema,
  getMessagesSchema,
} from '../validators/message.validator';

const router = Router();

/**
 * @route   POST /api/conversations
 * @desc    Create or get existing conversation
 * @access  Private
 */
router.post('/', requireAuth, validate(createConversationSchema), messageController.createConversation);

/**
 * @route   GET /api/conversations
 * @desc    Get all user's conversations
 * @access  Private
 */
router.get('/', requireAuth, messageController.getUserConversations);

/**
 * @route   GET /api/conversations/:id
 * @desc    Get conversation by ID
 * @access  Private
 */
router.get('/:id', requireAuth, messageController.getConversationById);

/**
 * @route   POST /api/conversations/:id/messages
 * @desc    Send a message in a conversation
 * @access  Private
 */
router.post('/:id/messages', requireAuth, validate(sendMessageSchema), messageController.sendMessage);

/**
 * @route   GET /api/conversations/:id/messages
 * @desc    Get messages in a conversation
 * @access  Private
 */
router.get('/:id/messages', requireAuth, validate(getMessagesSchema, 'query'), messageController.getMessages);

/**
 * @route   PATCH /api/conversations/:id/read
 * @desc    Mark all messages in conversation as read
 * @access  Private
 */
router.patch('/:id/read', requireAuth, messageController.markAsRead);

export default router;
