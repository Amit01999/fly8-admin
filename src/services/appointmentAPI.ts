import apiClient from './apiClient';

export interface Appointment {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    image?: string;
  };
  advisor?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  title: string;
  description?: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  meetingLink?: string;
  location?: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  studentId: string;
  title: string;
  description?: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  duration?: number;
  meetingLink?: string;
  location?: string;
  notes?: string;
}

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
}

export const appointmentAPI = {
  // Get all appointments with filters
  getAllAppointments: async (filters: AppointmentFilters = {}) => {
    const response = await apiClient.get('/admin/appointments', { params: filters });
    return response.data;
  },

  // Get single appointment
  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get(`/admin/appointments/${id}`);
    return response.data.appointment;
  },

  // Create new appointment
  createAppointment: async (data: CreateAppointmentData) => {
    const response = await apiClient.post('/admin/appointments', data);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id: string, data: Partial<CreateAppointmentData>) => {
    const response = await apiClient.put(`/admin/appointments/${id}`, data);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id: string, status: string, adminNotes?: string) => {
    const response = await apiClient.put(`/admin/appointments/${id}/status`, {
      status,
      adminNotes,
    });
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id: string, reason?: string) => {
    const response = await apiClient.put(`/admin/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id: string) => {
    const response = await apiClient.delete(`/admin/appointments/${id}`);
    return response.data;
  },

  // Get appointment statistics
  getAppointmentStats: async () => {
    const response = await apiClient.get('/admin/appointments/stats');
    return response.data.stats;
  },

  // Get today's appointments
  getTodayAppointments: async () => {
    const response = await apiClient.get('/admin/appointments/today');
    return response.data;
  },
};
