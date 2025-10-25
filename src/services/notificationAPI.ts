import apiClient from './apiClient';

export interface Notification {
  _id: string;
  recipient: string;
  recipientModel: 'student' | 'Admin';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'message' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  link?: string;
  metadata?: any;
  status: 'unread' | 'read' | 'archived';
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendNotificationData {
  studentId: string;
  title: string;
  message: string;
  type?: string;
  priority?: string;
  link?: string;
  metadata?: any;
}

export interface SendBulkNotificationData {
  studentIds: string[];
  title: string;
  message: string;
  type?: string;
  priority?: string;
  link?: string;
  metadata?: any;
}

export const notificationAPI = {
  // Get admin notifications
  getAdminNotifications: async (filters: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  } = {}) => {
    const response = await apiClient.get('/admin/notifications', { params: filters });
    return response.data;
  },

  // Send notification to single student
  sendNotificationToStudent: async (data: SendNotificationData) => {
    const response = await apiClient.post('/admin/notifications/send', data);
    return response.data;
  },

  // Send bulk notifications
  sendBulkNotifications: async (data: SendBulkNotificationData) => {
    const response = await apiClient.post('/admin/notifications/send-bulk', data);
    return response.data;
  },

  // Send notification to all students
  sendNotificationToAll: async (data: Omit<SendNotificationData, 'studentId'>) => {
    const response = await apiClient.post('/admin/notifications/send-all', data);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/admin/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await apiClient.put('/admin/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string) => {
    const response = await apiClient.delete(`/admin/notifications/${id}`);
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async () => {
    const response = await apiClient.get('/admin/notifications/stats');
    return response.data.stats;
  },

  // Get notifications for a specific student
  getStudentNotifications: async (studentId: string, page: number = 1, limit: number = 20) => {
    const response = await apiClient.get(`/admin/notifications/student/${studentId}`, {
      params: { page, limit },
    });
    return response.data;
  },
};
