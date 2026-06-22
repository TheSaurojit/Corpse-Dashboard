import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the proxy route to stream multipart/form-data bodies to the backend
  // without Next.js buffering them first (required for file uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
