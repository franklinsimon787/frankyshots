/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@frankyshots/db",
    ],
  },
};

export default nextConfig;