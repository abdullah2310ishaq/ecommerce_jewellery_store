import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com", // Google Photos
      "drive.google.com", // Google Drive (May not work directly)
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc**", // Allow Google Drive images
      },
    ],
  },
};

export default nextConfig;
