import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
