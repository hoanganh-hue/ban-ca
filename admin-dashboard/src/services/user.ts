import { apiClient } from './api';
import type {
  GameUser,
  GameSession,
  ApiResponse,
  PaginatedResponse
} from '@types/index';

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'all' | 'active' | 'inactive';
}

interface GetSessionsParams {
  page?: number;
  limit?: number;
  userId?: string;
  status?: 'all' | 'active' | 'completed';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class UserService {
  // Get all users with pagination and filters
  static async getUsers(params: GetUsersParams = {}): Promise<PaginatedResponse<GameUser>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<GameUser>>>('/users', {
      params
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get users');
  }
  
  // Get user by ID
  static async getUserById(id: string): Promise<{
    user: GameUser;
    stats: {
      totalSessions: number;
      totalFishCaught: number;
      totalCurrencyEarned: number;
      avgFishPerSession: number;
      avgCurrencyPerSession: number;
    };
    achievements: any[];
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`/users/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get user details');
  }
  
  // Update user
  static async updateUser(id: string, data: {
    username?: string;
    email?: string;
    profile?: {
      currency?: number;
      score?: number;
      level?: number;
      experience?: number;
      currentWeaponId?: number;
      weaponLevel?: number;
      settings?: any;
    };
  }): Promise<GameUser> {
    const response = await apiClient.put<ApiResponse<GameUser>>(`/users/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update user');
  }
  
  // Ban/Unban user
  static async toggleUserBan(id: string, reason?: string, duration?: number): Promise<void> {
    const response = await apiClient.post<ApiResponse>(`/users/${id}/ban`, {
      reason,
      duration
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update user ban status');
    }
  }
  
  // Delete user
  static async deleteUser(id: string, permanent: boolean = false): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/users/${id}`, {
      data: { permanent }
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete user');
    }
  }
  
  // Reset user password
  static async resetUserPassword(id: string, newPassword: string): Promise<void> {
    const response = await apiClient.post<ApiResponse>(`/users/${id}/reset-password`, {
      newPassword
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password');
    }
  }
  
  // Get user inventory
  static async getUserInventory(id: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/users/${id}/inventory`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get user inventory');
  }
  
  // Add item to user inventory
  static async addItemToUser(id: string, itemId: number, quantity: number = 1): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`/users/${id}/inventory`, {
      itemId,
      quantity
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add item to user');
  }
  
  // Remove item from user inventory
  static async removeItemFromUser(id: string, itemId: number, quantity: number = 1): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/users/${id}/inventory`, {
      data: { itemId, quantity }
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove item from user');
    }
  }
  
  // Get user sessions
  static async getUserSessions(id: string, params: GetSessionsParams = {}): Promise<PaginatedResponse<GameSession>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<GameSession>>>(
      `/users/${id}/sessions`,
      { params }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get user sessions');
  }
}
