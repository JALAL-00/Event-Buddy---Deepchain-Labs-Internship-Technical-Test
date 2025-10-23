// frontend/src/app/(dashboard)/layout.tsx

'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/shared/Footer';
import DashboardNavbar from '@/components/shared/DashboardNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // --- THIS IS THE CORRECTED LINE ---
  // It correctly uses '=' to destructure the values from the useAuth() hook call.
  const { isAuthenticated, isLoading, user } = useAuth();
  // --- END OF CORRECTION ---
  
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login'); 
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-light-violet">
            <p>Loading...</p> 
        </div>
    );
  }
  
  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-light-violet">
        <DashboardNavbar user={user!} />
        <main className="flex-grow">
            {children}
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}