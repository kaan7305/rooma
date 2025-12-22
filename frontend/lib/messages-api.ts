import apiClient from './api-client';
import { ApiResponse, Conversation, Message, CreateConversationData } from '@/types';

export const messagesApi = {
  // Get all conversations for current user
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversations');
    return response.data;
  },

  // Get single conversation
  getConversation: async (id: string): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.get<ApiResponse<Conversation>>(`/conversations/${id}`);
    return response.data;
  },

  // Create conversation
  createConversation: async (
    data: CreateConversationData
  ): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.post<ApiResponse<Conversation>>('/conversations', data);
    return response.data;
  },

  // Get messages in a conversation
  getMessages: async (conversationId: string): Promise<ApiResponse<Message[]>> => {
    const response = await apiClient.get<ApiResponse<Message[]>>(
      `/conversations/${conversationId}/messages`
    );
    return response.data;
  },

  // Send message
  sendMessage: async (conversationId: string, content: string): Promise<ApiResponse<Message>> => {
    const response = await apiClient.post<ApiResponse<Message>>(
      `/conversations/${conversationId}/messages`,
      { content }
    );
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (conversationId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch<ApiResponse<void>>(
      `/conversations/${conversationId}/read`
    );
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/conversations/${id}`);
    return response.data;
  },
};
