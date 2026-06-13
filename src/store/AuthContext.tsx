/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '../types';
import { profileApi } from '../api/profile.api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, username: string, role: 'USER' | 'ADMIN') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem('genzverse_token');
    localStorage.removeItem('genzverse_role');
    localStorage.removeItem('genzverse_username');
    localStorage.removeItem('genzverse_user');
    setUser(null);
  };

  const fetchUserProfile = useCallback(async (storedRole: 'USER' | 'ADMIN') => {
    try {
      const profile = await profileApi.getMe();
      const updatedUser = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        role: storedRole,
      };
      setUser(updatedUser);
      localStorage.setItem('genzverse_user', JSON.stringify(updatedUser));
    } catch {
      // Clear invalid token/session
      logout();
    }
  }, []);

  const refreshUser = async () => {
    const token = localStorage.getItem('genzverse_token');
    const storedRole = localStorage.getItem('genzverse_role') as 'USER' | 'ADMIN' | null;
    if (token && storedRole) {
      await fetchUserProfile(storedRole);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('genzverse_token');
      const storedRole = localStorage.getItem('genzverse_role') as 'USER' | 'ADMIN' | null;
      
      if (token && storedRole) {
        let cachedUser = null;
        try {
          const storedUser = localStorage.getItem('genzverse_user');
          if (storedUser) {
            cachedUser = JSON.parse(storedUser);
          }
        } catch {
          // Ignore parse error
        }

        setUser(cachedUser || {
          id: 0,
          username: localStorage.getItem('genzverse_username') || 'Writer',
          email: '',
          role: storedRole,
        });
        setIsLoading(false);

        try {
          await fetchUserProfile(storedRole);
        } catch {
          // fetchUserProfile already calls logout() on failure
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserProfile]);

  const login = async (token: string, username: string, role: 'USER' | 'ADMIN') => {
    localStorage.setItem('genzverse_token', token);
    localStorage.setItem('genzverse_role', role);
    localStorage.setItem('genzverse_username', username);

    const fallbackUser = {
      id: 0,
      username: username,
      email: '',
      role: role,
    };
    setUser(fallbackUser);
    localStorage.setItem('genzverse_user', JSON.stringify(fallbackUser));

    // Fetch full profile in background
    fetchUserProfile(role);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
