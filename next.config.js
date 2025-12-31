/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'robertsspaceindustries.com',
      },
      {
        protocol: 'https',
        hostname: 'media.robertsspaceindustries.com',
      }
    ],
  },
};

module.exports = nextConfig;
