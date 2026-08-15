/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'seller-app-product.s3.eu-north-1.amazonaws.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'thedailymeal.com' },
      { protocol: 'https', hostname: '5.imimg.com' },
      { protocol: 'https', hostname: 'images.herzindagi.info' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'drfuri-demo-images.s3.us-west-1.amazonaws.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
