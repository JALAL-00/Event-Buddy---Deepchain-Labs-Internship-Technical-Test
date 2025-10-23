// src/context/AuthContext.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  fullName?: string; // We'll add this later if needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on initial load
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<User & { sub: string }>(token);
        // 'sub' is the standard JWT property for subject (usually user ID)
        setUser({ id: decoded.sub, email: decoded.email, role: decoded.role });
      } catch (error) {
        console.error('Invalid token found', error);
        Cookies.remove('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    Cookies.set('auth_token', token, { expires: 1, secure: true, sameSite: 'strict' });
    const decoded = jwtDecode<User & { sub: string }>(token);
    setUser({ id: decoded.sub, email: decoded.email, role: decoded.role });
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    window.location.href = '/login'; // Redirect to login page
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};