import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/env';

// Map userId -> socketId for online tracking
const onlineUsers = new Map<string, string>();

/**
 * Verify JWT token from socket handshake
 */
const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
    (socket as any).userId = decoded.userId;
    (socket as any).email = decoded.email;
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
};

/**
 * Initialize Socket.io server
 */
export const initializeSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin.split(',').map((o) => o.trim()),
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as string;

    // Track online user
    onlineUsers.set(userId, socket.id);
    io.emit('user_online', { userId });
    socket.emit('online_users', Array.from(onlineUsers.keys()));

    console.log(`Socket connected: ${userId} (${socket.id})`);

    // --- Join conversation room ---
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // --- Messaging events ---
    socket.on('send_message', (data: { conversationId: string; message: any }) => {
      // Broadcast to conversation room (excluding sender)
      socket.to(`conversation:${data.conversationId}`).emit('new_message', {
        conversationId: data.conversationId,
        message: data.message,
      });
    });

    socket.on('typing_start', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing_start', {
        conversationId: data.conversationId,
        userId,
      });
    });

    socket.on('typing_stop', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing_stop', {
        conversationId: data.conversationId,
        userId,
      });
    });

    socket.on('message_read', (data: { conversationId: string; messageId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('message_read', {
        conversationId: data.conversationId,
        messageId: data.messageId,
        userId,
      });
    });

    // --- Notification events ---
    // Server-side: use emitToUser() to push notifications

    // --- Disconnect ---
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user_offline', { userId });
      console.log(`Socket disconnected: ${userId}`);
    });
  });

  return io;
};

/**
 * Send an event to a specific user (by userId)
 */
export const emitToUser = (io: Server, userId: string, event: string, data: unknown) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

/**
 * Get list of currently online user IDs
 */
export const getOnlineUserIds = (): string[] => {
  return Array.from(onlineUsers.keys());
};
