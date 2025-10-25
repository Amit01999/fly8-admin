import apiClient from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: string;
  permissions: {
    students: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    messages: { view: boolean; send: boolean; delete: boolean };
    appointments: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    notifications: { view: boolean; send: boolean; delete: boolean };
    feedback: { view: boolean; respond: boolean };
    analytics: { view: boolean };
  };
}

export interface LoginResponse {
  success: boolean;
  token: string;
  admin: AdminUser;
}

export const authAPI = {
  // Login admin
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post('/admin/auth/login', credentials);
    return response.data;
  },

  // Get admin profile
  getProfile: async (): Promise<AdminUser> => {
    const response = await apiClient.get('/admin/profile');
    return response.data.admin;
  },

  // Update admin profile
  updateProfile: async (data: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await apiClient.put('/admin/profile', data);
    return response.data.admin;
  },

  // Change password
  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await apiClient.put('/admin/profile/password', data);
    return response.data;
  },
};
