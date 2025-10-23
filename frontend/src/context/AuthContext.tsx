// frontend/src/context/AuthContext.tsx

'use client'; 

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';
import api from '@/lib/axios';
// Import AxiosError to help us filter expected errors from real bugs
import { AxiosError } from 'axios';

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Effect to run on initial component mount to check for an existing token
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // The axios interceptor automatically adds the token to this request
          const { data } = await api.get('/auth/profile');
          setUser(data);
        } catch (error) {
          // Token is invalid or expired, so remove it.
          // We use a milder log message here since an expired token is normal.
          console.warn('Session expired or invalid token.');
          localStorage.removeItem('token');
        }
      }
      // Finished initial loading, whether user was found or not
      setIsLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await api.post('/auth/login', data);
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      
      // After setting token, fetch user profile to update state
      const profileResponse = await api.get('/auth/profile');
      setUser(profileResponse.data);
      
      // Redirect based on role
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
    try {
      await api.post('/auth/register', data);
      // After successful registration, automatically log the user in
      await login({ email: data.email, password: data.password });
    } catch (error) {
      // --- SMART ERROR HANDLING ---
      // If the error is a 409 Conflict (duplicate email), it's an expected user error.
      // We don't want to clutter the console with red errors for this specific case.
      // For any other unexpected error (like a 500 server crash), we DO log it.
      if (error instanceof AxiosError && error.response?.status !== 409) {
          console.error('Unexpected registration error:', error);
      }
      
      // Always re-throw so the Register form can show the correct message to the user.
      throw error;
    }
  };

  const logout = () => {
    // 1. Navigate to the public homepage FIRST. This unmounts protected layouts.
    router.push('/');

    // 2. THEN, wrap the state-clearing logic in a setTimeout.
    // This gives the router enough time to complete navigation before 
    // the isAuthenticated flag flips to false, preventing accidental redirects to /login.
    setTimeout(() => {
        setUser(null);
        localStorage.removeItem('token');
    }, 100);
  };

  // Memoize the context value to prevent unnecessary re-renders of consumer components
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
