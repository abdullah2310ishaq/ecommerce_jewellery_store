"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Slide Data
const slides = [
  {
    id: 1,
    title: "Timeless Luxury Collection",
    description: "Exclusive handcrafted jewelry",
    img: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop",
  },
  {
    id: 2,
    title: "Winter Special Offers",
    description: "Discover unique elegance",
    img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop",
  },
  {
    id: 3,
    title: "Spring Glamour Collection",
    description: "Shine with perfection",
    img: "https://images.pexels.com/photos/2732096/pexels-photo-2732096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrevious = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="relative h-[calc(100vh-80px)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    priority
                    className="object-cover brightness-75"
                  />
                  {/* Dark Overlay for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </div>

                {/* Slide Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="max-w-4xl space-y-6 transform translate-y-12"
                  >
                    <h2 className="text-xl md:text-2xl text-yellow-300 font-light tracking-wider">
                      {slide.description}
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                      {slide.title}
                    </h1>
                    <Link href={slide.url}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md text-lg font-medium tracking-wide transition"
                      >
                        Explore Collection
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all"
      >
        <ChevronLeft className="w-8 h-8" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all"
      >
        <ChevronRight className="w-8 h-8" />
      </motion.button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrent(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-yellow-500 scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
