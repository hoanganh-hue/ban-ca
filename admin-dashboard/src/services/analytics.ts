import { apiClient } from './api';
import type {
  DashboardStats,
  GameStats,
  SystemHealth,
  TimeSeriesData,
  ApiResponse
} from '@types/index';

export class AnalyticsService {
  // Get dashboard statistics
  static async getDashboardStats(): Promise<{
    overview: DashboardStats;
    gameStats: GameStats;
    topPlayers: any[];
    lastUpdated: string;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/dashboard');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get dashboard stats');
  }
  
  // Get real-time statistics
  static async getRealTimeStats(): Promise<{
    onlineUsers: number;
    activeSessions: number;
    recentSessions: any[];
    criticalAlerts: number;
    timestamp: string;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/real-time');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get real-time stats');
  }
  
  // Get user analytics
  static async getUserAnalytics(period: string = '7d'): Promise<{
    period: string;
    dailyRegistrations: TimeSeriesData[];
    dailyActiveUsers: TimeSeriesData[];
    retentionData: any[];
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/users', {
      params: { period }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get user analytics');
  }
  
  // Get game analytics
  static async getGameAnalytics(period: string = '7d'): Promise<{
    period: string;
    dailySessions: TimeSeriesData[];
    weaponUsage: any[];
    performanceMetrics: any[];
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/game', {
      params: { period }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get game analytics');
  }
  
  // Get system metrics
  static async getSystemMetrics(hours: number = 24): Promise<{
    systemAlerts: any[];
    performanceData: any[];
    serverHealth: any;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/system', {
      params: { hours }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get system metrics');
  }
  
  // Export analytics data
  static async exportAnalytics(
    type: 'users' | 'sessions' | 'analytics',
    startDate: string,
    endDate: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<any> {
    const response = await apiClient.get('/analytics/export', {
      params: {
        type,
        startDate,
        endDate,
        format
      },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    
    return response;
  }
}
