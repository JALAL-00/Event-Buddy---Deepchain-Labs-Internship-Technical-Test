// src/app/(auth)/layout.tsx
import Link from 'next/link';
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-light-violet">
        {/* Header with Logo */}
        <header className="py-6">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-dark-gray w-fit">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="#4F46E5"/>
                    <path d="M12 21V11L18 16L12 21Z" fill="white"/>
                    <path d="M20 21V11H18V21H20Z" fill="white"/>
                  </svg>
                  <span>Event buddy.</span>
                </Link>
            </div>
        </header>
        {/* Form Container */}
        <main className="flex justify-center items-start pt-12 pb-20">
            {children}
        </main>
    </div>
  )
}