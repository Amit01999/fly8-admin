import apiClient from './apiClient';

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  image?: string;
  active: boolean;
  approved: boolean;
  profileCompletion?: number;
  additionalDetails?: any;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  country?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  recentRegistrations: number;
  studentsByCountry: { _id: string; count: number }[];
  profileCompletionRanges: {
    '0-25%': number;
    '26-50%': number;
    '51-75%': number;
    '76-100%': number;
  };
}

export const studentAPI = {
  // Get all students with filters and pagination
  getAllStudents: async (filters: StudentFilters = {}) => {
    const response = await apiClient.get('/admin/students', { params: filters });
    return response.data;
  },

  // Get single student by ID
  getStudentById: async (id: string): Promise<Student> => {
    const response = await apiClient.get(`/admin/students/${id}`);
    return response.data.student;
  },

  // Update student basic info
  updateStudent: async (id: string, data: Partial<Student>) => {
    const response = await apiClient.put(`/admin/students/${id}`, data);
    return response.data;
  },

  // Update student profile (assessment data)
  updateStudentProfile: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/students/${id}/profile`, data);
    return response.data;
  },

  // Update student status
  updateStudentStatus: async (
    id: string,
    data: { active?: boolean; approved?: boolean }
  ) => {
    const response = await apiClient.put(`/admin/students/${id}/status`, data);
    return response.data;
  },

  // Deactivate student (soft delete)
  deleteStudent: async (id: string) => {
    const response = await apiClient.delete(`/admin/students/${id}`);
    return response.data;
  },

  // Permanently delete student
  permanentlyDeleteStudent: async (id: string) => {
    const response = await apiClient.delete(`/admin/students/${id}/permanent`);
    return response.data;
  },

  // Restore deactivated student
  restoreStudent: async (id: string) => {
    const response = await apiClient.post(`/admin/students/${id}/restore`);
    return response.data;
  },

  // Get student statistics
  getStudentStats: async (): Promise<StudentStats> => {
    const response = await apiClient.get('/admin/students/stats');
    return response.data.stats;
  },
};
