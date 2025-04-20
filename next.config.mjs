/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Updated from experimental.appDir which is now the default in Next.js 15
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      {
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
      },
    ];
    return config;
  },
  // Ensure we can use both app/ and pages/ directories during migration
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

export default nextConfig;
