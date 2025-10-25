import axios from 'axios';

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL;
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // No response received
    return 'No response from server. Please check your connection.';
  } else {
    // Request setup error
    return error.message || 'An unexpected error occurred';
  }
};
