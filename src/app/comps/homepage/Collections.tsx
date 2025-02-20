"use client";

import Image from "next/image";
import Link from "next/link";

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
    img: "https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop?category=gold-necklaces",
  },
  {
    id: 3,
    name: "Platinum Bracelets",
    description: "Finely crafted platinum bracelets with exquisite designs.",
    img: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop?category=platinum-bracelets",
  },
  {
    id: 4,
    name: "Luxury Earrings",
    description: "Statement earrings with diamonds and pearls.",
    img: "https://images.pexels.com/photos/15785515/pexels-photo-15785515/free-photo-of-woman-holding-a-gold-earring.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/shop?category=luxury-earrings",
  },
];

const Collections = () => {
  return (
    <section className="py-16 bg-[#faf6f2] dark:bg-[#1e1e1e]">
      <div className="container mx-auto text-center">
        {/* Heading */}
        <h3 className="text-4xl font-bold text-gray-900 dark:text-[#f0e6d2] mb-12 tracking-wide">
          Featured Collections
        </h3>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.url}
              className="group relative block overflow-hidden rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105"
            >
              {/* Image */}
              <Image
                src={collection.img}
                alt={collection.name}
                width={500}
                height={500}
                className="w-full h-80 object-cover transition-opacity duration-500 group-hover:opacity-80"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h4 className="text-white text-2xl font-bold">{collection.name}</h4>
                <p className="text-gray-200 text-sm">{collection.description}</p>
                <button className="mt-4 px-4 py-2 bg-[#d4af37] text-black rounded-md text-sm font-semibold hover:bg-[#c09c2e] transition">
                  Explore Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
