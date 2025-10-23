import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    
    remotePatterns: [
      
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', 
        pathname: '/uploads/**', 
      },

      {
        protocol: 'https',
        hostname: 'images.unsplash.com', 
        port: '',
        pathname: '/**', 
      },

      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;