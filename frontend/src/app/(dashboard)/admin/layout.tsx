// frontend/src/app/(dashboard)/admin/layout.tsx

'use client'; // This component needs hooks for auth checks and routing.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // First, wait for the authentication status to be determined.
    if (isLoading) {
      return; // Do nothing while loading.
    }

    // After loading, if the user is NOT an admin, redirect them.
    // This covers both non-authenticated users and authenticated non-admin users.
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      // Redirect to the regular user dashboard or another appropriate page.
      router.push('/user/dashboard');
    }
  }, [user, isLoading, isAuthenticated, router]);

  // While checking the user's role, show a loading state.
  // This prevents the admin page content from flashing on screen for non-admin users.
  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen bg-light-violet">
        <p>Verifying access...</p>
      </div>
    );
  }

  // If the user is an admin, render the actual page content.
  return <>{children}</>;
}