import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",  // Google Photos & Drive Images
      "drive.google.com", // Google Drive (May still need URL handling)
    ],
  },
};

export default nextConfig;
