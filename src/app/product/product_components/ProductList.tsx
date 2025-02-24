"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

export interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];  // <--- updated to images
  rating?: number;
  isOnSale?: boolean;
}

interface ProductListProps {
  products: Product[];
}

const itemsPerPage = 3;

export default function ProductList({ products }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
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

        {/* Check if no products at all */}
        {products.length === 0 ? (
          <div className="text-center text-gray-300 mt-8">
            <p className="text-xl">No products found.</p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.length === 0 ? (
                <div className="col-span-full text-center text-gray-300">
                  <p className="text-lg">No products on this page.</p>
                </div>
              ) : (
                displayedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    style={{
                      transition: `opacity 0.6s ease-out ${index * 0.1}s`,
                      opacity: hasLoaded ? 1 : 0,
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls (only if there's at least one product) */}
            {displayedProducts.length > 0 && (
              <div className="mt-10 flex justify-center">
                <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
