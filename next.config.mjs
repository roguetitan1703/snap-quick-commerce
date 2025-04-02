/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "via.placeholder.com",
      "placehold.co",
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
