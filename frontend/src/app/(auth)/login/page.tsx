// frontend/src/app/(auth)/login/page.tsx

'use client'; 

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    
    event.preventDefault(); 
    
    setIsLoading(true);
    setError(null);
    
    try {
      
      await login({ email, password });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold text-dark-gray">Sign in</h2>
        <p className="mt-2 text-sm text-medium-gray">
          New User?{' '}
          <Link href="/register" className="font-semibold text-primary-blue hover:underline">
            Create an account
          </Link>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required
              placeholder="enter your email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="current-password"
              required
              placeholder="enter your password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <p className="form-error text-center bg-red-50 border border-red-200 p-3 rounded-md">
              {error}
            </p>
          )}
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full form-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}