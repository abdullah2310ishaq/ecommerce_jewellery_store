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

export default function NavbarSearchDropdown() {
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
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Product),
        }));
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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Search button in the navbar */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 text-yellow-300 hover:text-yellow-400 bg-gray-800 rounded"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      {/* Dropdown panel (animated) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Top bar with close button */}
            <div className="flex justify-end p-2 border-b border-gray-700">
              <button onClick={closeDropdown} className="text-gray-400 hover:text-yellow-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectedProduct ? (
              // --- PRODUCT DETAIL VIEW ---
              <div className="p-4 text-gray-200">
                <button
                  onClick={backToResults}
                  className="flex items-center gap-2 mb-4 text-yellow-400 hover:text-yellow-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Results</span>
                </button>
                <div className="relative w-full h-64 mb-4 rounded overflow-hidden">
                  <Image
                    src={selectedProduct.images?.[0] || "/placeholder.jpg"}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-yellow-300">
                  {selectedProduct.name}
                </h2>
                <p className="text-lg text-yellow-400 my-2">
                  Rs. {selectedProduct.price}
                </p>
                <div className="flex gap-4 mt-4">
                  <Link
                    href={`/product/${selectedProduct.id}`}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black rounded font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ) : (
              // --- SEARCH INPUT & RESULTS ---
              <>
                <div className="px-4 pb-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 pl-10 text-gray-100 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {loading ? (
                      <p className="p-4 text-yellow-400">Searching...</p>
                    ) : results.length > 0 ? (
                      results.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center p-3 border-b border-gray-700 last:border-none cursor-pointer hover:bg-gray-700"
                        >
                          <div className="relative w-12 h-12 mr-3">
                            <Image
                              src={product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="text-yellow-300 font-medium">
                              {product.name}
                            </p>
                            <p className="text-sm text-yellow-400">
                              Rs. {product.price}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : searchQuery.trim() ? (
                      <p className="p-4 text-center text-gray-400">
                        No products found
                      </p>
                    ) : (
                      <p className="p-4 text-center text-gray-400">
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
