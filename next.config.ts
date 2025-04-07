import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "firebasestorage.googleapis.com",
      "res.cloudinary.com", 

      
    ],
    loader:'custom',
    loaderFile: "./app/cloudinary_service.ts",
   
  },
};

export default nextConfig;
