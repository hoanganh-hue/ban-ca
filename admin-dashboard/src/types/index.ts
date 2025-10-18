// Admin User Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  role: AdminRole;
  isActive: boolean;
  isSuperAdmin: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  permissions: string[];
  isActive: boolean;
  isSystem: boolean;
}

export interface AdminSession {
  id: string;
  adminUserId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  adminUser: AdminUser;
  session: AdminSession;
}

export interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Game Types
export interface GameUser {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  currency: number;
  score: number;
  level: number;
  experience: number;
  currentWeaponId: number;
  weaponLevel: number;
  settings?: any;
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  id: string;
  userId: string;
  roomId?: string;
  startTime: string;
  endTime?: string;
  startScore: number;
  endScore?: number;
  fishCaught: number;
  currencyEarned: number;
  metadata?: any;
  user?: GameUser;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  userGrowthRate: number;
  totalSessions: number;
  activeSessions: number;
  systemAlerts: number;
}

export interface GameStats {
  totalFishCaught: number;
  totalCurrencyEarned: number;
  avgCurrencyPerSession: number;
}

export interface SystemHealth {
  healthScore: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  alerts: {
    critical: number;
    error: number;
    warning: number;
    recentErrors: number;
  };
  database: {
    connected: boolean;
  };
  system: {
    uptime: number;
    memory: any;
    cpu: any;
    nodeVersion: string;
    platform: string;
    timestamp: string;
  };
}

// Content Types
export interface ContentAsset {
  id: string;
  name: string;
  type: 'AUDIO' | 'TEXTURE' | 'MODEL' | 'IMAGE' | 'OTHER';
  category: string;
  filename: string;
  originalName?: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  url?: string;
  metadata?: any;
  isActive: boolean;
  isSystem: boolean;
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
}

// System Types
export interface SystemConfiguration {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'ARRAY';
  validation?: any;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface SystemAlert {
  id: string;
  type: 'ERROR' | 'WARNING' | 'INFO' | 'CRITICAL';
  category: string;
  title: string;
  message: string;
  metadata?: any;
  stackTrace?: string;
  isActive: boolean;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  notified: boolean;
  notifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface TimeSeriesData {
  date: string;
  [key: string]: number | string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  validation?: any;
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  actions?: {
    label: string;
    onClick: (row: T) => void;
    icon?: React.ComponentType;
    className?: string;
  }[];
}

// Notification Types
export interface AdminNotification {
  id: string;
  adminUserId?: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  data?: any;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  expiresAt?: string;
}

// Audit Log Types
export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  oldData?: any;
  newData?: any;
  metadata?: any;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
  adminUser?: AdminUser;
}
