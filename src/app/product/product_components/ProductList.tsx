"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const allProducts = [
  { id: 1, name: "Diamond Necklace", price: "$1,299", img: "https://images.pexels.com/photos/11914487/pexels-photo-11914487.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 2, name: "Gold Ring", price: "$899", img: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 3, name: "Platinum Bracelet", price: "$749", img: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 4, name: "Luxury Earrings", price: "$1,099", img: "https://images.pexels.com/photos/11914482/pexels-photo-11914482.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 5, name: "Gold Bracelet", price: "$1,299", img: "https://images.pexels.com/photos/14802904/pexels-photo-14802904.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 6, name: "Silver Ring", price: "$499", img: "https://images.pexels.com/photos/3641033/pexels-photo-3641033.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

const itemsPerPage = 3; 


const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  // Get products for the current page
  const displayedProducts = allProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default ProductList;
