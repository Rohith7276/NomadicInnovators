/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // disables next/image domain checks + optimization
  },
  reactStrictMode: false,
};

export default nextConfig;