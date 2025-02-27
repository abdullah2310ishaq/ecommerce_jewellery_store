"use client";

import React, { useRef } from "react";

const VideoHero = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/videos/messika.mp4" // Change to your video path
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default VideoHero;
