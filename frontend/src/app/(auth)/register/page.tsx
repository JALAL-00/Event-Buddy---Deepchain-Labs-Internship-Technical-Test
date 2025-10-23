// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      // Basic client-side validation
      if (!fullName || !email || !password) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      // We can add more specific validation later to match the backend
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        setLoading(false);
        return;
      }
  
      try {
        await api.post('/auth/register', {
          fullName,
          email,
          password,
        });
        // Redirect to login page on successful registration
        router.push('/login?registered=true');
      } catch (err: any) {
        // Display backend error message
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
        <div 
            className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
        >
            <h2 className="text-3xl font-bold text-center text-dark-gray">Sign Up</h2>
            <p className="text-center text-medium-gray">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-blue hover:underline">
                Sign in
              </Link>
            </p>

            {error && <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-lg">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-dark-gray">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jalal Uddin"
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-light-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                />
              </div>

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
                  autoComplete="new-password"
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
                  {loading ? 'Signing Up...' : 'Sign up'}
                </button>
              </div>
            </form>
        </div>
    );
}