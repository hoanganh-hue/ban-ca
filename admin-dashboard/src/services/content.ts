import { apiClient } from './api';
import type {
  ContentAsset,
  ApiResponse,
  PaginatedResponse
} from '@types/index';

interface GetAssetsParams {
  page?: number;
  limit?: number;
  type?: 'all' | 'AUDIO' | 'TEXTURE' | 'MODEL' | 'IMAGE';
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ContentService {
  // Get content assets
  static async getContentAssets(params: GetAssetsParams = {}): Promise<{
    assets: ContentAsset[];
    stats: {
      totalAssets: number;
      categories: { name: string; count: number }[];
      typeStats: { type: string; count: number; totalSize: number }[];
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/content', {
      params
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get content assets');
  }
  
  // Get asset by ID
  static async getAssetById(id: string): Promise<ContentAsset & { fileExists: boolean }> {
    const response = await apiClient.get<ApiResponse<ContentAsset & { fileExists: boolean }>>(
      `/content/${id}`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get asset details');
  }
  
  // Update asset
  static async updateAsset(id: string, data: {
    name?: string;
    category?: string;
    metadata?: any;
    isActive?: boolean;
  }): Promise<ContentAsset> {
    const response = await apiClient.put<ApiResponse<ContentAsset>>(`/content/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update asset');
  }
  
  // Delete asset
  static async deleteAsset(id: string, deleteFile: boolean = false): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/content/${id}`, {
      data: { deleteFile }
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete asset');
    }
  }
  
  // Upload asset
  static async uploadAsset(file: File, data: {
    name?: string;
    type?: string;
    category?: string;
    metadata?: any;
  } = {}): Promise<ContentAsset> {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });
    
    const response = await apiClient.post<ApiResponse<ContentAsset>>('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to upload asset');
  }
  
  // Bulk upload assets
  static async bulkUpload(files: File[], category: string = 'BULK_UPLOAD'): Promise<{
    uploadedAssets: ContentAsset[];
    errors: { filename: string; error: string }[];
    summary: {
      totalFiles: number;
      successful: number;
      failed: number;
    };
  }> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('category', category);
    
    const response = await apiClient.post<ApiResponse<any>>('/content/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to upload assets');
  }
  
  // Update asset usage
  static async updateAssetUsage(id: string): Promise<{
    assetId: string;
    usageCount: number;
    lastUsed: string;
  }> {
    const response = await apiClient.post<ApiResponse<any>>(`/content/${id}/usage`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update asset usage');
  }
  
  // Get unused assets
  static async getUnusedAssets(days: number = 30): Promise<{
    unusedAssets: ContentAsset[];
    summary: {
      count: number;
      totalSize: number;
      totalSizeMB: number;
      cutoffDate: string;
    };
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/content/unused/list', {
      params: { days }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get unused assets');
  }
  
  // Cleanup assets
  static async cleanupAssets(days: number = 30, deleteFiles: boolean = false): Promise<{
    summary: {
      totalAssets: number;
      deletedRecords: number;
      deletedFiles: number;
      errors: number;
    };
    errors: { assetId: string; filename: string; error: string }[];
  }> {
    const response = await apiClient.post<ApiResponse<any>>('/content/cleanup', {
      days,
      deleteFiles
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to cleanup assets');
  }
  
  // Generate thumbnails
  static async generateThumbnails(id: string): Promise<ContentAsset> {
    const response = await apiClient.post<ApiResponse<ContentAsset>>(`/content/${id}/thumbnails`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to generate thumbnails');
  }
}
