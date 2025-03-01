"use client";

import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firebase/firebase_services/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowLeft } from "lucide-react";

// Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
}

export default function SearchWithModal() {
  // Controls dropdown visibility
  const [open, setOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected product (for detailed view)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Ref for the entire search container (button + dropdown)
  const containerRef = useRef<HTMLDivElement>(null);

  // Firestore query: fetch matching products when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const ref = collection(firestore, "products");
        const qSearch = query(
          ref,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff")
        );
        const snapshot = await getDocs(qSearch);

        // Omit `id` from doc.data() (if it exists) to avoid duplication 
        // and use doc.id from Firestore as the primary ID.
        const productList = snapshot.docs.map((doc) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _unused, ...productData } = doc.data() as Product;
          return {
            id: doc.id,
            ...productData,
          };
        });

        setResults(productList);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchQuery]);

  // Toggle the dropdown open/close and reset state on open
  const toggleDropdown = () => {
    setOpen((prev) => !prev);
    if (!open) {
      setSearchQuery("");
      setResults([]);
      setSelectedProduct(null);
    }
  };

  // Close dropdown and reset state
  const closeDropdown = () => {
    setOpen(false);
    setSearchQuery("");
    setResults([]);
    setSelectedProduct(null);
  };

  // Return to search results from product detail view
  const backToResults = () => {
    setSelectedProduct(null);
  };

  // Outside click detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search input in the navbar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          onClick={toggleDropdown}
          placeholder="Search jewelry..."
          className="w-full px-4 py-2 pl-10 text-gray-600 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FB6F90] focus:border-transparent text-sm"
        />
      </div>

      {/* Dropdown panel (animated) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Top bar with close button */}
            <div className="flex justify-between items-center p-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Search Results</h3>
              <button
                onClick={closeDropdown}
                className="text-gray-400 hover:text-[#FB6F90]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedProduct ? (
              // --- PRODUCT DETAIL VIEW ---
              <div className="p-4">
                <button
                  onClick={backToResults}
                  className="flex items-center gap-2 mb-4 text-[#FB6F90] hover:text-[#FB6F90]/90"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Results</span>
                </button>
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct.images?.[0] || "/placeholder.jpg"}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedProduct.name}
                </h2>
                <p className="text-lg text-[#FB6F90] my-2">
                  Rs. {selectedProduct.price}
                </p>
                <div className="flex gap-4 mt-4">
                  <Link
                    href={`/product/${selectedProduct.id}`}
                    className="px-4 py-2 bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded-md font-medium text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ) : (
              // --- SEARCH INPUT & RESULTS ---
              <>
                <div className="px-4 py-3">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FB6F90] w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 pl-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB6F90] text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {loading ? (
                      <p className="p-4 text-[#FB6F90] text-center text-sm">Searching...</p>
                    ) : results.length > 0 ? (
                      results.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center p-3 border-b border-gray-100 last:border-none cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-12 h-12 mr-3">
                            <Image
                              src={product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-[#FB6F90] font-medium">
                              Rs. {product.price}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : searchQuery.trim() ? (
                      <p className="p-4 text-center text-gray-500 text-sm">
                        No products found
                      </p>
                    ) : (
                      <p className="p-4 text-center text-gray-500 text-sm">
                        Start typing to search...
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}