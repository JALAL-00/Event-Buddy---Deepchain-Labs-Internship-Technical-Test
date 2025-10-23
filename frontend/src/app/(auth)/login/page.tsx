// frontend/src/app/(auth)/login/page.tsx

'use client'; // This is an interactive form, so it must be a Client Component.

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth(); // Get the login function from our AuthContext.
  
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for handling submission status and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    // Prevent the form's default reload behavior
    event.preventDefault(); 
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the login function from the context
      await login({ email, password });
      // The context handles redirection on success, so we don't need to do it here.
    } catch (err: any) {
      // If the context's login function throws an error, we catch it here.
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      // Ensure the loading state is turned off, whether success or failure
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