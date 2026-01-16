import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/modules/auth';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      // Assuming GET /auth/me or similar exists, otherwise we decode token or rely on stored user
      // For now, we'll assume we can get user profile or refresh token validates it
       const response = await authApi.getCurrentUser();
       setUser(response.data.data); // Adjust based on actual API response structure
    } catch (error) {
      localStorage.removeItem('token');
      // navigate('/login'); // Optional: redirect on auth failure
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (data: any) => {
    const response = await authApi.login(data);
    const { accessToken, user } = response.data.data; // Adjust based on API
    localStorage.setItem('token', accessToken);
    setUser(user);
    navigate('/');
  };

  const register = async (data: any) => {
    await authApi.register(data);
    navigate('/login');
  };

  const logout = async () => {
    try {
        await authApi.logout();
    } catch (e) {
        console.error("Logout failed", e)
    }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
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
