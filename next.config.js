/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow /api/* Python functions to coexist with Next.js pages
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
