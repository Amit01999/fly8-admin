import apiClient from './apiClient';

export interface Feedback {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  service: string;
  rating: number;
  subject: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  adminResponse?: string;
  respondedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  respondedAt?: string;
  attachments?: {
    url: string;
    fileName: string;
    fileType: string;
  }[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackFilters {
  page?: number;
  limit?: number;
  status?: string;
  service?: string;
  rating?: number;
  priority?: string;
  category?: string;
}

export const feedbackAPI = {
  // Get all feedback with filters
  getAllFeedback: async (filters: FeedbackFilters = {}) => {
    const response = await apiClient.get('/admin/feedback', { params: filters });
    return response.data;
  },

  // Get single feedback
  getFeedbackById: async (id: string): Promise<Feedback> => {
    const response = await apiClient.get(`/admin/feedback/${id}`);
    return response.data.feedback;
  },

  // Get feedback for a specific student
  getStudentFeedback: async (studentId: string, page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/admin/feedback/student/${studentId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Respond to feedback
  respondToFeedback: async (id: string, response: string) => {
    const res = await apiClient.post(`/admin/feedback/${id}/respond`, { response });
    return res.data;
  },

  // Update feedback status
  updateFeedbackStatus: async (
    id: string,
    data: { status?: string; priority?: string }
  ) => {
    const response = await apiClient.put(`/admin/feedback/${id}/status`, data);
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (id: string) => {
    const response = await apiClient.delete(`/admin/feedback/${id}`);
    return response.data;
  },

  // Get feedback statistics
  getFeedbackStats: async () => {
    const response = await apiClient.get('/admin/feedback/stats');
    return response.data.stats;
  },

  // Get unresponded feedback
  getUnrespondedFeedback: async (limit: number = 10) => {
    const response = await apiClient.get('/admin/feedback/unresponded', {
      params: { limit },
    });
    return response.data;
  },

  // Toggle feedback visibility
  toggleFeedbackVisibility: async (id: string) => {
    const response = await apiClient.put(`/admin/feedback/${id}/visibility`);
    return response.data;
  },
};
