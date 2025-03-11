"use client";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import {
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  rating?: number;
  isOnSale?: boolean;
}

interface ProductListProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 3;

export default function ProductList({ products }: ProductListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort products (memoized)
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );

    const sorted = filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [products, searchQuery, sortBy, sortOrder]);

  // Compute total pages (memoized)
  const totalPages = useMemo(
    () => Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE),
    [filteredAndSortedProducts],
  );

  // Get paginated products (memoized)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredAndSortedProducts, currentPage]);

  // Clear filters callback (stable reference)
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  }, []);

  return (
    <section className="bg-gray-50 py-10 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and search */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2"
          >
            Our Exclusive Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-gray-600 mb-6"
          >
            Discover our handpicked selection of beautiful jewelry pieces
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FB6F90] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Controls bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-4 mb-8 flex flex-wrap justify-between items-center gap-4"
        >
          {/* Left side - View toggle and results count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-1 border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-[#FB6F90] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-[#FB6F90] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {filteredAndSortedProducts.length}
              </span>{" "}
              products
            </p>
          </div>

          {/* Right side - Sort controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600">
                Sort:
              </label>
              <div className="flex">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "price" | "rating")
                  }
                  className="bg-white rounded-l-md border border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#FB6F90] focus:border-[#FB6F90]"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="p-1.5 bg-white rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-50"
                  aria-label={
                    sortOrder === "asc" ? "Sort ascending" : "Sort descending"
                  }
                >
                  {sortOrder === "asc" ? (
                    <ChevronUp size={18} className="text-gray-700" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Clear filters button */}
            {(searchQuery || sortBy !== "name" || sortOrder !== "asc") && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#FB6F90] hover:text-[#d85476] flex items-center gap-1"
              >
                <X size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* No products message */}
        {filteredAndSortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <p className="text-lg text-gray-600 mb-2">
              No products found
            </p>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#FB6F90] text-white rounded-md hover:bg-[#d85476] transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            {/* Product Grid/List */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              <AnimatePresence mode="wait">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-white border border-gray-300 text-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-white border border-gray-300 text-gray-600 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
