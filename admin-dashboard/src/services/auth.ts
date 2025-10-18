import { apiClient } from './api';
import type {
  LoginRequest,
  LoginResponse,
  AdminUser,
  AdminSession,
  ApiResponse
} from '../types';

export class AuthService {
  private static readonly TOKEN_KEY = 'admin_token';
  private static readonly USER_KEY = 'admin_user';
  
  // Login
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store token and user data
      localStorage.setItem(this.TOKEN_KEY, response.data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.adminUser));
      
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }
  
  // Logout
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      this.clearAuthData();
    }
  }
  
  // Get current user profile
  static async getProfile(): Promise<AdminUser> {
    const response = await apiClient.get<ApiResponse<AdminUser>>('/auth/profile');
    
    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get profile');
  }
  
  // Update profile
  static async updateProfile(data: Partial<AdminUser>): Promise<AdminUser> {
    const response = await apiClient.put<ApiResponse<AdminUser>>('/auth/profile', data);
    
    if (response.success && response.data) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }
  
  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post<ApiResponse>('/auth/change-password', {
      currentPassword,
      newPassword
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  }
  
  // Get sessions
  static async getSessions(): Promise<AdminSession[]> {
    const response = await apiClient.get<ApiResponse<AdminSession[]>>('/auth/sessions');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get sessions');
  }
  
  // Revoke session
  static async revokeSession(sessionId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/auth/sessions/${sessionId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to revoke session');
    }
  }
  
  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  // Get stored user
  static getUser(): AdminUser | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }
  
  // Check if authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }
  
  // Clear auth data
  static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
  
  // Check if user has permission
  static hasPermission(permission: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.isSuperAdmin) return true;
    
    // Check role permissions
    return user.role?.permissions?.includes(permission) || 
           user.role?.permissions?.includes('*') || 
           false;
  }
  
  // Check if user has any of the permissions
  static hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }
  
  // Check if user has all permissions
  static hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }
}
