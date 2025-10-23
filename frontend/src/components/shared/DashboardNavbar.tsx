// src/components/shared/DashboardNavbar.tsx
'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DashboardNavbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-dark-gray">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="8" fill="#4F46E5"/>
                        <path d="M12 21V11L18 16L12 21Z" fill="white"/>
                        <path d="M20 21V11H18V21H20Z" fill="white"/>
                      </svg>
                      <span>Event buddy.</span>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-medium-gray font-medium">
                        Hello, {user?.role === 'ADMIN' ? 'Admin' : 'User'}
                    </span>
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-blue rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                       <LogOut size={16} />
                       Logout
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default DashboardNavbar;