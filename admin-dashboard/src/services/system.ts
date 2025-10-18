import { apiClient } from './api';
import type {
  SystemConfiguration,
  SystemAlert,
  SystemHealth,
  ApiResponse,
  PaginatedResponse
} from '@types/index';

interface GetConfigurationsParams {
  category?: string;
  search?: string;
}

interface GetAlertsParams {
  page?: number;
  limit?: number;
  type?: 'all' | 'ERROR' | 'WARNING' | 'INFO' | 'CRITICAL';
  category?: string;
  status?: 'all' | 'active' | 'resolved';
}

export class SystemService {
  // Get system configurations
  static async getConfigurations(params: GetConfigurationsParams = {}): Promise<{
    configurations: SystemConfiguration[];
    categories: { name: string; count: number }[];
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/system/config', {
      params
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get system configurations');
  }
  
  // Get configuration by key
  static async getConfigurationByKey(key: string): Promise<SystemConfiguration> {
    const response = await apiClient.get<ApiResponse<SystemConfiguration>>(`/system/config/${key}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get configuration');
  }
  
  // Update configuration
  static async updateConfiguration(
    key: string,
    value: any,
    description?: string
  ): Promise<SystemConfiguration> {
    const response = await apiClient.put<ApiResponse<SystemConfiguration>>(
      `/system/config/${key}`,
      { value, description }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update configuration');
  }
  
  // Create configuration
  static async createConfiguration(data: {
    key: string;
    value: any;
    category: string;
    description?: string;
    dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'ARRAY';
    validation?: any;
    isSystem?: boolean;
  }): Promise<SystemConfiguration> {
    const response = await apiClient.post<ApiResponse<SystemConfiguration>>(
      '/system/config',
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create configuration');
  }
  
  // Delete configuration
  static async deleteConfiguration(key: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/system/config/${key}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete configuration');
    }
  }
  
  // Get system alerts
  static async getSystemAlerts(params: GetAlertsParams = {}): Promise<PaginatedResponse<SystemAlert>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<SystemAlert>>>(
      '/system/alerts',
      { params }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get system alerts');
  }
  
  // Create system alert
  static async createSystemAlert(data: {
    type: 'ERROR' | 'WARNING' | 'INFO' | 'CRITICAL';
    category: string;
    title: string;
    message: string;
    metadata?: any;
  }): Promise<SystemAlert> {
    const response = await apiClient.post<ApiResponse<SystemAlert>>(
      '/system/alerts',
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create system alert');
  }
  
  // Resolve system alert
  static async resolveSystemAlert(id: string, resolution?: string): Promise<SystemAlert> {
    const response = await apiClient.post<ApiResponse<SystemAlert>>(
      `/system/alerts/${id}/resolve`,
      { resolution }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to resolve alert');
  }
  
  // Get system health
  static async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiClient.get<ApiResponse<SystemHealth>>('/system/health');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get system health');
  }
  
  // Export configurations
  static async exportConfigurations(category?: string): Promise<any> {
    const response = await apiClient.get('/system/config/export', {
      params: { category },
      responseType: 'blob'
    });
    
    return response;
  }
  
  // Import configurations
  static async importConfigurations(
    configurations: any[],
    overwrite: boolean = false
  ): Promise<{
    imported: number;
    updated: number;
    skipped: number;
    errors: { key: string; error: string }[];
  }> {
    const response = await apiClient.post<ApiResponse<any>>('/system/config/import', {
      configurations,
      overwrite
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to import configurations');
  }
}
