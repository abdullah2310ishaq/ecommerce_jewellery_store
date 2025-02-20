"use client";

import Image from "next/image";
import Link from "next/link";

const bestSellers = [
  {
    id: 1,
    name: "Royal Diamond Ring",
    price: "$1,299",
    img: "https://images.pexels.com/photos/1451474/pexels-photo-1451474.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop?product=diamond-ring",
  },
  {
    id: 2,
    name: "Elegant Gold Necklace",
    price: "$899",
    img: "https://images.pexels.com/photos/11914487/pexels-photo-11914487.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop?product=gold-necklace",
  },
  {
    id: 3,
    name: "Luxury Pearl Bracelet",
    price: "$749",
    img: "https://images.pexels.com/photos/3641033/pexels-photo-3641033.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop?product=pearl-bracelet",
  },
  {
    id: 4,
    name: "Statement Diamond Earrings",
    price: "$1,099",
    img: "https://images.pexels.com/photos/11914482/pexels-photo-11914482.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop?product=diamond-earrings",
  },
];

const BestSellers = () => {
  return (
    <section className="py-16 bg-[#faf6f2] dark:bg-[#1e1e1e]">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <h3 className="text-4xl font-bold text-gray-900 dark:text-[#f0e6d2] mb-12 tracking-wide">
          Best Sellers
        </h3>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
          {bestSellers.map((product) => (
            <Link
              key={product.id}
              href={product.url}
              className="group relative block overflow-hidden rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105"
            >
              {/* Product Image */}
              <Image
                src={product.img}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-80 object-cover transition-opacity duration-500 group-hover:opacity-80"
              />

              {/* Overlay with Product Info */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-end text-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h4 className="text-white text-2xl font-bold">{product.name}</h4>
                <p className="text-[#d4af37] text-lg font-semibold">{product.price}</p>
                <button className="mt-4 px-4 py-2 bg-[#d4af37] text-black rounded-md text-sm font-semibold hover:bg-[#c09c2e] transition">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
