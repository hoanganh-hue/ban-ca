import React, { useState, useEffect } from 'react';
import { systemService } from '@services/system';
import {
  Server,
  Database,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Settings,
  Monitor,
  Users,
  Globe
} from 'lucide-react';
import LoadingSpinner from '@components/LoadingSpinner';
import toast from 'react-hot-toast';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastCheck: string;
  services: {
    api: { status: 'up' | 'down'; responseTime: number };
    database: { status: 'up' | 'down'; connections: number };
    redis: { status: 'up' | 'down'; memory: number };
    websocket: { status: 'up' | 'down'; connections: number };
  };
  performance: {
    cpu: number;
    memory: { used: number; total: number };
    disk: { used: number; total: number };
    network: { in: number; out: number };
  };
  metrics: {
    activeUsers: number;
    totalSessions: number;
    requestsPerMinute: number;
    errorRate: number;
  };
}

interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
    scheduledStart?: string;
    scheduledEnd?: string;
  };
  gameConfig: {
    maxSessionDuration: number;
    maxPlayersPerRoom: number;
    startingCurrency: number;
    experienceMultiplier: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireEmailVerification: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    webhookUrl: string;
  };
}

const StatusCard: React.FC<{
  title: string;
  status: 'up' | 'down' | 'healthy' | 'warning' | 'critical';
  value?: string | number;
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, status, value, icon: Icon, color }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'down':
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <Icon className={`w-6 h-6 ${color} mr-2`} />
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {getStatusIcon(status)}
          </div>
          {value && (
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const System: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'logs'>('overview');

  const fetchSystemHealth = async () => {
    try {
      const data = await systemService.getSystemHealth();
      setHealth(data);
    } catch (error) {
      console.error('Error fetching system health:', error);
      toast.error('Failed to load system health');
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const data = await systemService.getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Failed to load system settings');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSystemHealth(), fetchSystemSettings()]);
      setLoading(false);
    };
    loadData();

    // Auto-refresh system health every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMaintenanceToggle = async (enabled: boolean) => {
    if (!settings) return;
    
    try {
      setSettingsLoading(true);
      await systemService.updateSystemSettings({
        ...settings,
        maintenance: { ...settings.maintenance, enabled }
      });
      await fetchSystemSettings();
      toast.success(`Maintenance mode ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      toast.error('Failed to update maintenance mode');
    } finally {
      setSettingsLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading system status..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600">Monitor system health and manage configurations</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchSystemHealth}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* System Overview Alert */}
      {health && health.status !== 'healthy' && (
        <div className={`p-4 rounded-lg border ${
          health.status === 'warning' 
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {health.status === 'warning' ? (
              <AlertTriangle className="w-5 h-5 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">
              System Status: {health.status === 'warning' ? 'Warning' : 'Critical'}
            </span>
          </div>
          <p className="mt-1 text-sm">
            {health.status === 'warning' 
              ? 'Some services are experiencing issues. Please check the details below.' 
              : 'Critical issues detected. Immediate attention required.'}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Logs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && health && (
        <div className="space-y-6">
          {/* Service Status */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Service Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard
                title="API Server"
                status={health.services.api.status}
                value={`${health.services.api.responseTime}ms`}
                icon={Server}
                color="text-blue-500"
              />
              <StatusCard
                title="Database"
                status={health.services.database.status}
                value={`${health.services.database.connections} conn`}
                icon={Database}
                color="text-green-500"
              />
              <StatusCard
                title="Redis Cache"
                status={health.services.redis.status}
                value={formatBytes(health.services.redis.memory)}
                icon={Activity}
                color="text-red-500"
              />
              <StatusCard
                title="WebSocket"
                status={health.services.websocket.status}
                value={`${health.services.websocket.connections} conn`}
                icon={Wifi}
                color="text-purple-500"
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                    <p className="text-2xl font-bold text-gray-900">{health.performance.cpu.toFixed(1)}%</p>
                  </div>
                  <Cpu className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${health.performance.cpu}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Memory</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatBytes(health.performance.memory.used)}
                    </p>
                  </div>
                  <MemoryStick className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(health.performance.memory.used / health.performance.memory.total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disk Usage</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatBytes(health.performance.disk.used)}
                    </p>
                  </div>
                  <HardDrive className="w-8 h-8 text-purple-500" />
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(health.performance.disk.used / health.performance.disk.total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatUptime(health.uptime)}
                    </p>
                  </div>
                  <Monitor className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Game Metrics */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Game Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{health.metrics.activeUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{health.metrics.totalSessions}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Requests/Min</p>
                    <p className="text-2xl font-bold text-gray-900">{health.metrics.requestsPerMinute}</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Error Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{health.metrics.errorRate.toFixed(2)}%</p>
                  </div>
                  <AlertTriangle className={`w-8 h-8 ${
                    health.metrics.errorRate > 5 ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && settings && (
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Enable maintenance mode to prevent user access</p>
              </div>
              <button
                onClick={() => handleMaintenanceToggle(!settings.maintenance.enabled)}
                disabled={settingsLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.maintenance.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenance.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {settings.maintenance.enabled && (
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Maintenance mode is active:</strong> {settings.maintenance.message}
                </p>
              </div>
            )}
          </div>

          {/* Game Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Game Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Session Duration (minutes)</label>
                <input
                  type="number"
                  value={settings.gameConfig.maxSessionDuration}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Players Per Room</label>
                <input
                  type="number"
                  value={settings.gameConfig.maxPlayersPerRoom}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Starting Currency</label>
                <input
                  type="number"
                  value={settings.gameConfig.startingCurrency}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.gameConfig.experienceMultiplier}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Logs</h3>
          <p className="text-gray-500">Log viewer functionality coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default System;