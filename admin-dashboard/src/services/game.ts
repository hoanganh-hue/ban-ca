import { apiClient } from './api';
import type {
  GameSession,
  ApiResponse,
  PaginatedResponse
} from '@types/index';

interface GetSessionsParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'active' | 'completed';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userId?: string;
  roomId?: string;
}

interface GetLeaderboardsParams {
  type?: 'score' | 'fish' | 'currency';
  period?: 'all' | '24h' | '7d' | '30d';
  limit?: number;
}

export class GameService {
  // Get game sessions
  static async getGameSessions(params: GetSessionsParams = {}): Promise<{
    sessions: GameSession[];
    stats: {
      totalSessions: number;
      totalFishCaught: number;
      totalCurrency: number;
      avgFishPerSession: number;
      avgCurrencyPerSession: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/game/sessions', {
      params
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get game sessions');
  }
  
  // Get session by ID
  static async getSessionById(id: string): Promise<{
    session: GameSession;
    duration: number;
    isActive: boolean;
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`/game/sessions/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get session details');
  }
  
  // Force end a session
  static async endSession(id: string, reason?: string): Promise<GameSession> {
    const response = await apiClient.post<ApiResponse<GameSession>>(
      `/game/sessions/${id}/end`,
      { reason }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to end session');
  }
  
  // Get active rooms
  static async getActiveRooms(): Promise<{
    rooms: any[];
    totalRooms: number;
    totalActivePlayers: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/game/rooms');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get active rooms');
  }
  
  // Close a room
  static async closeRoom(roomId: string, reason?: string): Promise<{
    roomId: string;
    endedSessions: number;
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/game/rooms/${roomId}/close`,
      { reason }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to close room');
  }
  
  // Get game statistics
  static async getGameStats(period: string = '24h'): Promise<{
    period: string;
    overallStats: {
      totalSessions: number;
      totalFishCaught: number;
      totalCurrency: number;
      avgFishPerSession: number;
      avgCurrencyPerSession: number;
    };
    recentSessions: GameSession[];
    popularWeapons: any[];
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/game/stats', {
      params: { period }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get game statistics');
  }
  
  // Get leaderboards
  static async getLeaderboards(params: GetLeaderboardsParams = {}): Promise<{
    type: string;
    period: string;
    leaderboard: any[];
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/game/leaderboards', {
      params
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get leaderboards');
  }
  
  // Broadcast message to all players
  static async broadcastMessage(
    message: string,
    type: 'info' | 'warning' | 'error' | 'success' = 'info',
    duration: number = 5000
  ): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/game/broadcast', {
      message,
      type,
      duration
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to broadcast message');
  }
}
