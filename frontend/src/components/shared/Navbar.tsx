// src/components/shared/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-10 py-6">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-dark-gray">
              {/* This is a simple SVG placeholder for the logo */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#4F46E5"/>
                <path d="M12 21V11L18 16L12 21Z" fill="white"/>
                <path d="M20 21V11H18V21H20Z" fill="white"/>
              </svg>
              <span>Event buddy.</span>
            </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          {/* CORRECTED "SIGN IN" BUTTON STYLE */}
          <Link href="/login">
            <button className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-blue rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
              Sign In
            </button>
          </Link>
          <Link href="/register">
            <button className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-blue rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;