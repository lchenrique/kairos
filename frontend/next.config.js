/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows production validation while the local preview keeps running.
  distDir: process.env.KAIROS_BUILD_DIR || ".next",
  async redirects() {
    return [
      { source: "/login", destination: "/auth?mode=login", permanent: false },
      { source: "/cadastro", destination: "/auth?mode=signup", permanent: false },
      { source: "/setup", destination: "/auth?mode=signup", permanent: false },
      { source: "/forgot-password", destination: "/auth?mode=recovery", permanent: false },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
