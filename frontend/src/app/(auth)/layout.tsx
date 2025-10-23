// frontend/src/app/(auth)/layout.tsx

import React from 'react';

// This layout component will wrap the login and register pages.
// Its only job is to provide the centered page styling.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-light-violet p-4 sm:p-6">
      {/* 
        The 'children' prop will be either the Login page component 
        or the Register page component.
      */}
      {children}
    </main>
  );
}