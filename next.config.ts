import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // <-- Tambahkan baris ini untuk mengatasi error Turbopack
};

export default withPWAConfig(nextConfig);