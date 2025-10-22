// src/components/shared/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-light-gray">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2 text-2xl font-bold text-dark-gray">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#4F46E5"/>
                <path d="M12 21V11L18 16L12 21Z" fill="white"/>
                <path d="M20 21V11H18V21H20Z" fill="white"/>
              </svg>
              <span>Event buddy.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-medium-gray font-medium">
                <Link href="/" className="hover:text-primary-blue">Home</Link>
                <Link href="/login" className="hover:text-primary-blue">Sign In</Link>
                <Link href="/register" className="hover:text-primary-blue">Sign Up</Link>
                <Link href="/privacy" className="hover:text-primary-blue">Privacy Policy</Link>
            </div>
        </div>

        <div className="mt-8 border-t border-light-gray pt-6 text-center text-sm text-medium-gray">
            <p>&copy; {new Date().getFullYear()} Event buddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;