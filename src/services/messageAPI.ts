import apiClient from './apiClient';

export interface Message {
  _id: string;
  conversationId: string;
  sender: any;
  senderModel: 'student' | 'Admin';
  recipient: any;
  recipientModel: 'student' | 'Admin';
  content: string;
  attachments?: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }[];
  status: 'sent' | 'delivered' | 'read';
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  conversationId: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export interface SendMessageData {
  studentId: string;
  content: string;
  attachments?: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }[];
}

export const messageAPI = {
  // Get all conversations
  getAllConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/admin/messages/conversations');
    return response.data.conversations;
  },

  // Get messages for a conversation
  getConversationMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ) => {
    const response = await apiClient.get(`/admin/messages/${conversationId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Send a message
  sendMessage: async (data: SendMessageData) => {
    const response = await apiClient.post('/admin/messages/send', data);
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    const response = await apiClient.put(`/admin/messages/${messageId}/read`);
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    const response = await apiClient.delete(`/admin/messages/${messageId}`);
    return response.data;
  },

  // Get message statistics
  getMessageStats: async () => {
    const response = await apiClient.get('/admin/messages/stats');
    return response.data.stats;
  },

  // Search messages
  searchMessages: async (query: string, conversationId?: string) => {
    const response = await apiClient.get('/admin/messages/search', {
      params: { query, conversationId },
    });
    return response.data;
  },
};
