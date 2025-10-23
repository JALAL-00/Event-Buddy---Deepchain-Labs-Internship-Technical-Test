// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    role: 'ADMIN' | 'USER';
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); // Get the login function from our context
    const registered = searchParams.get('registered');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      try {
        const response = await api.post('/auth/login', { email, password });
        const { access_token } = response.data;
        
        // Use our context's login function to set the state and cookie
        login(access_token); 

        const decodedToken = jwtDecode<DecodedToken>(access_token);

        // Redirect based on role
        if (decodedToken.role === 'ADMIN') {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/user/dashboard'); // Or '/' if you prefer the homepage
        }
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div 
          className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
      >
        <h2 className="text-3xl font-bold text-center text-dark-gray">Sign in</h2>
        <p className="text-center text-medium-gray">
          New User?{' '}
          <Link href="/register" className="font-semibold text-primary-blue hover:underline">
            Create an account
          </Link>
        </p>

        {registered && <div className="p-3 text-sm text-center text-green-800 bg-green-100 rounded-lg">Registration successful! Please sign in.</div>}
        {error && <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-gray">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email"
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-light-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-gray">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter your password"
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-light-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    );
}