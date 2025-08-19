/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/(main)/dashboard", destination: "/dashboard" },
      { source: "/(main)/:path*", destination: "/:path*" },
    ]
  },
  async redirects() {
    return [
      { source: "/(main)/:path*", destination: "/:path*", permanent: false },
    ]
  },
}

export default nextConfig
