/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add trailingSlash for static export compatibility
  trailingSlash: true,
};

module.exports = nextConfig;