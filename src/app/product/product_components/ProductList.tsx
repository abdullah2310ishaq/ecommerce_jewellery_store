"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { Product } from "../../types/Product"; // Ensure the path is correct

// Sample Products
const allProducts: Product[] = [
  { id: "1", name: "Diamond Necklace", price: "$1,299", img: "https://images.pexels.com/photos/11914487/pexels-photo-11914487.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "2", name: "Gold Ring", price: "$899", img: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "3", name: "Platinum Bracelet", price: "$749", img: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "4", name: "Luxury Earrings", price: "$1,099", img: "https://images.pexels.com/photos/11914482/pexels-photo-11914482.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "5", name: "Gold Bracelet", price: "$1,299", img: "https://images.pexels.com/photos/14802904/pexels-photo-14802904.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "6", name: "Silver Ring", price: "$499", img: "https://images.pexels.com/photos/3641033/pexels-photo-3641033.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

const itemsPerPage = 3;

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // We'll use this state to trigger our fade-in effect
  const [hasLoaded, setHasLoaded] = useState(false);

  // Trigger the fade-in once the component mounts
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  // Get products for the current page
  const displayedProducts = allProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 text-yellow-100 py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 text-center">
          Our Exclusive Jewelry Collection
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              // Inline style to create a fade-in effect with a small stagger per product
              style={{
                transition: `opacity 0.6s ease-out ${index * 0.1}s`,
                opacity: hasLoaded ? 1 : 0,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-10 flex justify-center">
          <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </section>
  );
};

export default ProductList;
