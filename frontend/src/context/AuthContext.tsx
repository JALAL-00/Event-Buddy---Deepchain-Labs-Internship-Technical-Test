// frontend/src/context/AuthContext.tsx

'use client'; 

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';
import api from '@/lib/axios';

// --- (No changes to the types or interface) ---
type LoginData = { email: string; password: string; };
type RegisterData = LoginData & { fullName: string; };
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
// --- (End of unchanged section) ---

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/profile');
          setUser(data);
        } catch (error) {
          console.error('Failed to load user from token:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    loadUserFromToken();
  }, []);

  const login = async (data: LoginData) => {
    // ... login function is unchanged
    try {
      const response = await api.post('/auth/login', data);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const profileResponse = await api.get('/auth/profile');
      setUser(profileResponse.data);
      if (profileResponse.data.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    // ... register function is unchanged
    try {
      await api.post('/auth/register', data);
      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };
  
  // --- THIS IS THE DEFINITIVE FIX FOR LOGOUT ---
  const logout = () => {
    // First, command the router to go to the homepage.
    router.push('/');

    // THEN, wrap the state-clearing logic in a setTimeout.
    // This gives the router time to navigate away from the protected layout
    // BEFORE the isAuthenticated flag turns false. This prevents the
    // layout's own redirect logic from firing.
    setTimeout(() => {
        setUser(null);
        localStorage.removeItem('token');
    }, 100); // A small delay is enough to ensure navigation completes.
  };
  // --- END OF CORRECTION ---

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};