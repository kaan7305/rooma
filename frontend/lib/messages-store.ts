import { create } from 'zustand';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  participant1Id: string;
  participant1Name: string;
  participant1Initials: string;
  participant2Id: string;
  participant2Name: string;
  participant2Initials: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessagesState {
  messages: Message[];
  conversations: Conversation[];
  loadMessages: () => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (conversationId: string, userId: string) => void;
  getUserConversations: (userId: string) => Conversation[];
  getConversationMessages: (conversationId: string) => Message[];
  createConversation: (conversation: Omit<Conversation, 'id' | 'lastMessage' | 'lastMessageTime' | 'unreadCount'>) => string;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: [],
  conversations: [],

  loadMessages: () => {
    const messagesJson = localStorage.getItem('rooma_messages');
    const conversationsJson = localStorage.getItem('rooma_conversations');

    if (messagesJson) {
      try {
        const messages = JSON.parse(messagesJson);
        set({ messages });
      } catch (error) {
        console.error('Failed to load messages', error);
      }
    }

    if (conversationsJson) {
      try {
        const conversations = JSON.parse(conversationsJson);
        set({ conversations });
      } catch (error) {
        console.error('Failed to load conversations', error);
      }
    }
  },

  sendMessage: (messageData) => {
    const { messages, conversations } = get();

    const newMessage: Message = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    set({ messages: updatedMessages });
    localStorage.setItem('rooma_messages', JSON.stringify(updatedMessages));

    // Update conversation
    const conversationIndex = conversations.findIndex(c => c.id === messageData.conversationId);
    if (conversationIndex !== -1) {
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        lastMessage: messageData.content,
        lastMessageTime: newMessage.timestamp,
        unreadCount: updatedConversations[conversationIndex].unreadCount + 1,
      };
      set({ conversations: updatedConversations });
      localStorage.setItem('rooma_conversations', JSON.stringify(updatedConversations));
    }
  },

  markAsRead: (conversationId, userId) => {
    const { messages, conversations } = get();

    // Mark messages as read
    const updatedMessages = messages.map(msg =>
      msg.conversationId === conversationId && msg.receiverId === userId && !msg.read
        ? { ...msg, read: true }
        : msg
    );
    set({ messages: updatedMessages });
    localStorage.setItem('rooma_messages', JSON.stringify(updatedMessages));

    // Update conversation unread count
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, unreadCount: 0 }
        : conv
    );
    set({ conversations: updatedConversations });
    localStorage.setItem('rooma_conversations', JSON.stringify(updatedConversations));
  },

  getUserConversations: (userId) => {
    const { conversations } = get();
    return conversations
      .filter(conv => conv.participant1Id === userId || conv.participant2Id === userId)
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  },

  getConversationMessages: (conversationId) => {
    const { messages } = get();
    return messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  createConversation: (conversationData) => {
    const { conversations } = get();

    // Check if conversation already exists
    const existing = conversations.find(
      c => c.propertyId === conversationData.propertyId &&
           ((c.participant1Id === conversationData.participant1Id && c.participant2Id === conversationData.participant2Id) ||
            (c.participant1Id === conversationData.participant2Id && c.participant2Id === conversationData.participant1Id))
    );

    if (existing) {
      return existing.id;
    }

    const newConversation: Conversation = {
      ...conversationData,
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };

    const updatedConversations = [...conversations, newConversation];
    set({ conversations: updatedConversations });
    localStorage.setItem('rooma_conversations', JSON.stringify(updatedConversations));

    return newConversation.id;
  },
}));
