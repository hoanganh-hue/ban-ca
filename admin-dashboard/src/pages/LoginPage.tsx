import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Waves, Fish } from 'lucide-react';
import LoadingSpinner from '@components/LoadingSpinner';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(formData);
    } catch (error: any) {
      // Error handling is already done in the AuthContext
      console.error('Login failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="lg" text="Signing you in..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="relative">
                <Waves className="w-8 h-8 text-primary-600 animate-wave" />
                <Fish className="w-4 h-4 text-secondary-600 absolute -bottom-1 -right-1 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Underwater Fishing Game Management
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="form-label">
                  Username or Email
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="form-input"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="form-input pr-10"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary py-3 text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Default credentials: admin / admin123456
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Ocean Theme */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 ocean-gradient">
          <div className="absolute inset-0 bg-black bg-opacity-10" />
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Fish className="w-12 h-12 text-white/30" />
          </div>
          <div className="absolute top-1/2 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
            <Fish className="w-8 h-8 text-white/20" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
            <Fish className="w-16 h-16 text-white/15" />
          </div>
          <div className="absolute top-3/4 right-1/4 animate-float" style={{ animationDelay: '3s' }}>
            <Waves className="w-10 h-10 text-white/25" />
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Dive into Management</h3>
          <p className="text-lg opacity-90">
            Comprehensive admin tools for your underwater fishing game
          </p>
          <div className="mt-4 space-y-2 text-sm opacity-75">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>User & Game Session Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Real-time Analytics & Monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Content & Asset Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>System Configuration & Alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
