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
  // Do not use `output: 'export'` or custom `distDir` when the app uses
  // dynamic API routes or requires a server runtime. A Node server build
  // is needed for the API routes under `app/api/*`.
  trailingSlash: true,
}

export default nextConfig
