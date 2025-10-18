import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: '/admin/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Return the response data directly for successful requests
    return response.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          toast.error(data.message || 'Access denied');
          break;
          
        case 404:
          // Not found
          toast.error(data.message || 'Resource not found');
          break;
          
        case 422:
          // Validation error
          if (data.errors) {
            data.errors.forEach((err: string) => toast.error(err));
          } else {
            toast.error(data.message || 'Validation error');
          }
          break;
          
        case 429:
          // Rate limit exceeded
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Internal server error
          toast.error('Internal server error. Please try again.');
          break;
          
        default:
          // Other errors
          toast.error(data.message || 'Something went wrong');
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
      return Promise.reject({
        success: false,
        message: 'Network error'
      });
    } else {
      // Other error
      toast.error('Something went wrong');
      return Promise.reject({
        success: false,
        message: error.message
      });
    }
  }
);

export default api;

// Export common HTTP methods with proper typing
export const apiClient = {
  get: <T = any>(url: string, config?: any) => api.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: any) => api.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any) => api.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: any) => api.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: any) => api.delete<T>(url, config),
};

// Utility functions for handling API responses
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.message) {
    toast.error(error.message);
  } else if (typeof error === 'string') {
    toast.error(error);
  } else {
    toast.error('Something went wrong');
  }
};

export const handleApiSuccess = (message?: string) => {
  if (message) {
    toast.success(message);
  }
};
