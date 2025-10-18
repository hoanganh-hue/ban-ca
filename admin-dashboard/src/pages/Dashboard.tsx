import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService } from '@services/analytics';
import {
  Users,
  Activity,
  GamepadIcon,
  DollarSign,
  TrendingUp,
  Fish,
  Trophy,
  Clock
} from 'lucide-react';
import LoadingSpinner from '@components/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  totalRevenue: number;
  avgSessionDuration: number;
  topFish: Array<{ name: string; count: number }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend?: { value: number; isPositive: boolean };
  color: string;
}> = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${
              trend.isPositive ? '' : 'rotate-180'
            }`} />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.username}! Here's what's happening with your underwater fishing game.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Activity}
          trend={{ value: 8, isPositive: true }}
          color="bg-green-500"
        />
        <StatCard
          title="Game Sessions"
          value={stats.totalSessions.toLocaleString()}
          icon={GamepadIcon}
          trend={{ value: 15, isPositive: true }}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Fish Caught */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Most Popular Fish</h2>
            <Fish className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.topFish.map((fish, index) => (
              <div key={fish.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="ml-3 text-gray-900">{fish.name}</span>
                </div>
                <span className="text-gray-600">{fish.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Session Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Session Analytics</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Average Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avgSessionDuration / 60)}m</p>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div>
              <p className="text-sm text-gray-600">Sessions Today</p>
              <p className="text-lg font-semibold text-gray-900">{Math.floor(stats.totalSessions * 0.1).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peak Hours</p>
              <p className="text-lg font-semibold text-gray-900">2PM - 6PM</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Trophy className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {new Date(activity.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">View and edit user accounts</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <GamepadIcon className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">Game Sessions</h3>
            <p className="text-sm text-gray-600">Monitor active sessions</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Fish className="w-6 h-6 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Content Management</h3>
            <p className="text-sm text-gray-600">Update game content</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Activity className="w-6 h-6 text-yellow-500 mb-2" />
            <h3 className="font-medium text-gray-900">System Status</h3>
            <p className="text-sm text-gray-600">Check system health</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;