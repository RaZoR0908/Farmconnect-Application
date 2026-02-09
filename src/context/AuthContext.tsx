import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      const token = await authService.getStoredToken();
      
      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      const response = await authService.login({ identifier, password });
      
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true };
      }
      
      return { success: false, message: response.message || 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (registerData: any) => {
    try {
      const response = await authService.register(registerData);
      
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true };
      }
      
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
