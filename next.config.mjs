/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['thedailymeal.com'],
      },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
