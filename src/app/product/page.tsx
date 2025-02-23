"use client";

import Filters from "./product_components/Filters";
import ProductList from "./product_components/ProductList";

// Main Products Page Component
const ProductsPage = () => {
  return (
    <section className="bg-gradient-to-b from-black via-gray-900 to-black text-yellow-100 min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-center text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
          Explore Our Exclusive Jewelry
        </h1>
        <p className="text-center text-yellow-300 text-sm md:text-base mb-8">
          Where heritage meets contemporary luxury
        </p>

        {/* Layout - Sidebar + Products Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-full md:w-1/4 bg-black/30 p-6 rounded-lg border border-yellow-600">
            <Filters />
          </aside>

          {/* Right Section - Products Grid */}
          <div className="w-full md:w-3/4">
            <ProductList />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
