/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': __dirname,
      '@': __dirname,
    };
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'scss')],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '~': '.',
        '@': '.',
      }
    }
  }
};

export default nextConfig;
