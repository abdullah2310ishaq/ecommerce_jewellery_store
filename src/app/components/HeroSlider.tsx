"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Timeless Luxury Collection",
    description: "Exclusive handcrafted jewelry",
    img: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop",
    bg: "bg-gradient-to-r from-[#2c2c2c] to-[#1e1e1e]",
  },
  {
    id: 2,
    title: "Winter Special Offers",
    description: "Discover unique elegance",
    img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop",
    bg: "bg-gradient-to-r from-[#1e1e1e] to-[#121212]",
  },
  {
    id: 3,
    title: "Spring Glamour Collection",
    description: "Shine with perfection",
    img: "https://images.pexels.com/photos/2732096/pexels-photo-2732096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop",
    bg: "bg-gradient-to-r from-[#121212] to-[#090909]",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col xl:flex-row items-center justify-center gap-12`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center xl:items-start justify-center text-center xl:text-left space-y-6 px-8">
              <h2 className="text-lg md:text-xl lg:text-2xl text-gray-400">{slide.description}</h2>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white">{slide.title}</h1>
              <Link href={slide.url}>
                <button className="mt-4 rounded-md bg-[#d4af37] text-black py-3 px-6 text-lg font-semibold hover:bg-[#c09c2e] transition">
                  SHOP NOW
                </button>
              </Link>
            </div>

            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt="Jewelry Collection"
                fill
                sizes="100%"
                className="object-cover brightness-90 rounded-xl shadow-lg"
              />
            </div>
          </div>
        ))}
      </div>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 border-2 border-gray-500 rounded-full cursor-pointer transition ${
              current === index ? "bg-[#d4af37] border-[#d4af37] scale-125" : "bg-transparent"
            }`}
            onClick={() => setCurrent(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
