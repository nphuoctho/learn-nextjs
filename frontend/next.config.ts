import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pixels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
