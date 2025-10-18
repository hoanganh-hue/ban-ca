import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@components/LoadingSpinner';

// Lazy load components for better performance
const LoginPage = React.lazy(() => import('@pages/LoginPage'));
const DashboardLayout = React.lazy(() => import('@components/layout/DashboardLayout'));
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Users = React.lazy(() => import('@pages/Users'));
const GameSessions = React.lazy(() => import('@pages/GameSessions'));
const Content = React.lazy(() => import('@pages/Content'));
const System = React.lazy(() => import('@pages/System'));
const Profile = React.lazy(() => import('@pages/Profile'));

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route component (redirects if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App Routes component
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users/*" element={<Users />} />
                  <Route path="/game/*" element={<GameSessions />} />
                  <Route path="/content/*" element={<Content />} />
                  <Route path="/system/*" element={<System />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Catch all - redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
