"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const collections = [
  {
    id: 1,
    name: "Diamond Rings",
    description: "Elegance in every stone, crafted for timeless beauty.",
    img: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop?category=diamond-rings",
  },
  {
    id: 2,
    name: "Gold Necklaces",
    description: "Luxurious 24K gold necklaces for a royal touch.",
    img: "https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop?category=gold-necklaces",
  },
  {
    id: 3,
    name: "Platinum Bracelets",
    description: "Finely crafted platinum bracelets with exquisite designs.",
    img: "https://images.pexels.com/photos/14802904/pexels-photo-14802904.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop?category=platinum-bracelets",
  },
  {
    id: 4,
    name: "Luxury Earrings",
    description: "Statement earrings with diamonds and pearls.",
    img: "https://images.pexels.com/photos/14802904/pexels-photo-14802904.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop?category=luxury-earrings",
  },
  
];

const Collections = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-[#faf6f2] dark:bg-[#1e1e1e] relative">
      <div className="container mx-auto text-center">
        <h3 className="text-3xl font-semibold text-gray-900 dark:text-[#f0e6d2] mb-10">
          Featured Collections
        </h3>

        {/* Scroll Buttons */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-[#d4af37] text-white rounded-full shadow-md hidden md:block"
          onClick={scrollLeft}
        >
          ◄
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-[#d4af37] text-white rounded-full shadow-md hidden md:block"
          onClick={scrollRight}
        >
          ►
        </button>

        {/* Scrollable Collection List */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto px-6 py-4 scrollbar-hide"
        >
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.url}
              className="group relative w-[300px] flex-shrink-0 overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <Image
                src={collection.img}
                alt={collection.name}
                width={400}
                height={400}
                className="w-full h-64 object-cover transition-opacity duration-500 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <h4 className="text-white text-lg font-bold">{collection.name}</h4>
                <p className="text-gray-300 text-sm text-center">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
