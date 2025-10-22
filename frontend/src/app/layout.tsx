import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// @ts-ignore: Allow side-effect global CSS import without type declarations
import './globals.css';
import { JSX } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Event Buddy",
  description: "Discover and book amazing events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>): JSX.Element { 
  return (
    <html lang="en">
      <body className={`${inter.className} bg-light-violet`}>
        {/* This is the crucial part that was missing. It tells Next.js where to render the page content. */}
        {children}
      </body>
    </html>
  );
}