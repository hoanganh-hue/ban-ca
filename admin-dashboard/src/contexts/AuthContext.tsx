import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '@services/auth';
import type { AuthContextType, LoginRequest, AdminUser } from '@types/index';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = AuthService.getToken();
        const storedUser = AuthService.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          
          // Optionally verify token validity by fetching profile
          // This is commented out to avoid unnecessary API calls on every refresh
          // You can uncomment this if you want to always verify the token
          /*
          AuthService.getProfile()
            .then((profile) => {
              setUser(profile);
            })
            .catch(() => {
              // Token is invalid, clear auth
              handleLogout();
            });
          */
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        AuthService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(credentials);
      
      setToken(response.token);
      setUser(response.adminUser);
      
      toast.success(`Welcome back, ${response.adminUser.name}!`);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // Re-throw so the login form can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      handleLogout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local auth even if API call fails
      handleLogout();
      toast.success('Logged out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    AuthService.clearAuthData();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hooks for permission checking
export const usePermission = (permission: string): boolean => {
  const { user } = useAuth();
  return AuthService.hasPermission(permission);
};

export const usePermissions = (permissions: string[]): {
  hasAll: boolean;
  hasAny: boolean;
  permissions: { [key: string]: boolean };
} => {
  const { user } = useAuth();
  
  const permissionMap = permissions.reduce((acc, permission) => {
    acc[permission] = AuthService.hasPermission(permission);
    return acc;
  }, {} as { [key: string]: boolean });

  return {
    hasAll: AuthService.hasAllPermissions(permissions),
    hasAny: AuthService.hasAnyPermission(permissions),
    permissions: permissionMap,
  };
};

// HOC for protecting components with permissions
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  fallback?: React.ComponentType
) => {
  return (props: P) => {
    const hasPermission = usePermission(requiredPermission);
    
    if (!hasPermission) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent />;
      }
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};
