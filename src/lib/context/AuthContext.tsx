'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define the AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string;
  login: (token: string, user: any) => Promise<void>;
  updateUserInfo: (user: any) => Promise<void>;
  checkAuth: (onSuccess: () => void, onError: () => void) => Promise<void>;
  logout: () => void;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>({});
  const [token, setToken] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    checkAuth(() => {}, () => {});
  }, []);

  const checkAuth = async (onSuccess: () => void, onError: () => void) => {
    const token = sessionStorage.getItem('access_token') || '';
    const storedUser = sessionStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setToken(token);
      onSuccess();
    } else {
      onError();
    }
  };

  const login = async (token: string, user: any) => {
    try {
      setIsAuthenticated(true);
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setToken(token);
      router.replace('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserInfo = async (user: any) => {
    try {
      sessionStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user');
    setUser({});
    setToken('');
    router.replace('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        token,
        updateUserInfo,
        checkAuth,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};