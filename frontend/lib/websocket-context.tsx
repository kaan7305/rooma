'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (conversationId: string, message: string) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  markMessageRead: (conversationId: string, messageId: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  typingUsers: Record<string, boolean>;
  onlineUsers: Set<string>;
  onMessageReceived: (callback: (conversationId: string, message: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);
  const messageCallbacksRef = useRef<Array<(conversationId: string, message: any) => void>>([]);

  useEffect(() => {
    // Get auth token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const socket = io(BACKEND_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.log('WebSocket connection error:', err.message);
      setIsConnected(false);
    });

    // Online/offline tracking
    socket.on('online_users', (userIds: string[]) => {
      setOnlineUsers(new Set(userIds));
    });

    socket.on('user_online', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socket.on('user_offline', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Message events
    socket.on('new_message', (data: { conversationId: string; message: any }) => {
      messageCallbacksRef.current.forEach((cb) => cb(data.conversationId, data.message));
    });

    // Typing events
    socket.on('typing_start', (data: { conversationId: string; userId: string }) => {
      setTypingUsers((prev) => ({ ...prev, [data.conversationId]: true }));
    });

    socket.on('typing_stop', (data: { conversationId: string; userId: string }) => {
      setTypingUsers((prev) => ({ ...prev, [data.conversationId]: false }));
    });

    // Read receipt events
    socket.on('message_read', (_data: { conversationId: string; messageId: string; userId: string }) => {
      // Can be used to update message read status in UI
    });

    // Notification events (pushed from server)
    socket.on('notification', (data: any) => {
      // Can integrate with toast/notification system
      console.log('Notification received:', data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((conversationId: string, message: string) => {
    socketRef.current?.emit('send_message', { conversationId, message });
  }, []);

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    const event = isTyping ? 'typing_start' : 'typing_stop';
    socketRef.current?.emit(event, { conversationId });
  }, []);

  const markMessageRead = useCallback((conversationId: string, messageId: string) => {
    socketRef.current?.emit('message_read', { conversationId, messageId });
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join_conversation', conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave_conversation', conversationId);
  }, []);

  const onMessageReceived = useCallback((callback: (conversationId: string, message: any) => void) => {
    messageCallbacksRef.current.push(callback);
    // Return unsubscribe function
    return () => {
      messageCallbacksRef.current = messageCallbacksRef.current.filter((cb) => cb !== callback);
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        sendMessage,
        setTyping,
        markMessageRead,
        joinConversation,
        leaveConversation,
        typingUsers,
        onlineUsers,
        onMessageReceived,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}
