// frontend/src/app/(auth)/register/page.tsx

'use client'; // This is an interactive form, so it must be a Client Component.

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth(); // Get the register function from our AuthContext.
  
  // State for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for handling submission status and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    // Prevent the form's default reload behavior
    event.preventDefault(); 
    
    // Basic validation
    if (!fullName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call the register function from the context
      await register({ fullName, email, password });
      // The context handles login and redirection on success
    } catch (err: any) {
      // If the context's register function throws an error, we catch it
      const errorMessage = err.response?.data?.message || 'Registration failed. This email may already be in use.';
      setError(errorMessage);
    } finally {
      // Ensure the loading state is turned off
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold text-dark-gray">Sign Up</h2>
        <p className="mt-2 text-sm text-medium-gray">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input 
              id="fullName" 
              name="fullName" 
              type="text" 
              autoComplete="name" 
              required
              placeholder="Jalal Uddin"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>

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
              autoComplete="new-password"
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
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}