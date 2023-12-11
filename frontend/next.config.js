/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

// allow storage.googleapis.com to provide images
module.exports = {
  images: {
    domains: ["storage.googleapis.com"],
  },
};
