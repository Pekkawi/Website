/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true, // temporary fix for deploying with Docker for now
  },
};

module.exports = nextConfig;
