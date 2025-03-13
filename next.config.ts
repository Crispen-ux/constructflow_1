import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['hieqzbbkttqueaezrgfu.supabase.co'], // Add the Supabase domain here
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint errors during build
  },
};

export default nextConfig;
