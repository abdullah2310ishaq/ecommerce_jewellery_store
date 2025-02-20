"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Crown, Diamond, Star } from 'lucide-react';

const WelcomePage = () => {
  const router = useRouter();

  const [shine, setShine] = useState(false);

  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Enhanced Logo Section */}
        <div
          className={`mb-12 transform transition-all duration-700 hover:scale-105 relative ${
            shine ? 'scale-110' : 'scale-100'
          }`}
          onMouseEnter={() => setShine(true)}
          onMouseLeave={() => setShine(false)}
        >
          {/* Decorative ring around logo */}
          <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 opacity-20 animate-spin-slow blur-md" />
          
          <div className="relative">
            <img
              src="/logo.png"
              alt="H&H Jewelry Logo"
              className="mx-auto w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl"
              height={384}
              width={384}
            />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-yellow-400 opacity-10 blur-xl rounded-full" />
          </div>
          
          {/* Decorative elements around logo */}
          <Diamond className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 animate-float" />
          <Diamond className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 animate-float-delayed" />
        </div>

        <div className="relative mb-6 p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-shimmer" />
          <h1 className="relative bg-black px-8 py-4 text-4xl md:text-5xl font-serif text-white">
            H&H Jewelry
          </h1>
        </div>

        <p className="text-lg text-gray-300 mb-12 max-w-lg">
          Where timeless elegance meets contemporary design. 
          Discover our exquisite collection of handcrafted treasures.
        </p>

        <button
          onClick={() => router.push("/home")}
          className="group relative overflow-hidden rounded-full bg-yellow-600 px-8 py-4 transition-transform hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center space-x-2 text-white">
            <span className="text-lg font-medium">Enter the Collection</span>
            <Diamond className="w-5 h-5 animate-pulse" />
          </div>
        </button>

        <div className="absolute left-10 top-10 animate-float">
          <Diamond className="w-8 h-8 text-yellow-500 opacity-50" />
        </div>
        <div className="absolute right-10 bottom-10 animate-float-delayed">
          <Star className="w-8 h-8 text-yellow-500 opacity-50" />
        </div>
      </div>
    </div>
  );
};

const styles = `
@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-shimmer {
  animation: shimmer 8s linear infinite;
  background-size: 200% 100%;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
`;

export default WelcomePage;