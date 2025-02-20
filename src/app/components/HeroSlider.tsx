import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div
        className="w-max h-full flex transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div className="relative w-screen h-full" key={slide.id}>
            {/* Full-screen image */}
            <div className="absolute inset-0">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                priority
                className="object-cover brightness-75"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-12">
              <div className="max-w-4xl space-y-6 transform translate-y-12">
                <h2 className="text-xl md:text-2xl text-yellow-300 font-light tracking-wider">
                  {slide.description}
                </h2>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                  {slide.title}
                </h1>
                <Link href={slide.url}>
                <button className="mt-8 px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md text-lg font-medium tracking-wide transition">
                  Explore Collection
              </button>

                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all transform hover:scale-110"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all transform hover:scale-110"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {slides.map((_, index) => (
          <button
          key={index}
          onClick={() => setCurrent(index)}
          className={`w-4 h-4 rounded-full transition-all duration-300 ${
            current === index 
              ? "bg-yellow-500" 
              : "bg-white/50 hover:bg-white/80"
          }`}
        />
        
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;