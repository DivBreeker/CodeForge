import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/mockBackend';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Supabase auth check is async
    const initAuth = async () => {
        try {
            const session = await api.auth.getSession();
            if (session) {
                setUser(session.user);
                setToken(session.token);
            }
        } catch (error) {
            console.error("Session check failed", error);
        } finally {
            setIsLoading(false);
        }
    };
    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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