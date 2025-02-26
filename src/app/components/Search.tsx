"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firebase/firebase_services/firebaseConfig";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
}

export default function SearchWithModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Firestore Query on searchQuery changes
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

        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

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

  return (
    <div className="relative w-full max-w-lg">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 pl-12 text-gray-100 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />
        <Search className="absolute left-3 top-3 w-5 h-5 text-yellow-400" />
      </div>

      {/* Results List */}
      {searchQuery.trim() && (
        <div className="mt-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-gray-200 max-h-72 overflow-auto">
          {loading ? (
            <p className="p-4 text-yellow-400">Searching...</p>
          ) : results.length > 0 ? (
            results.map(product => (
              <div
                key={product.id}
                className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-all"
                onClick={() => setSelectedProduct(product)}
              >
                <Image
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-yellow-300">{product.name}</p>
                  <p className="text-sm text-yellow-400">Rs. {product.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-400 text-center">No products found</p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 p-6 w-full max-w-md relative rounded-lg shadow-xl text-gray-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image */}
            <div className="relative w-full h-56 mb-4">
              <Image
                src={selectedProduct.images?.[0] || "/placeholder.jpg"}
                alt={selectedProduct.name}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* Product Info */}
            <h2 className="text-2xl text-yellow-300 font-bold">
              {selectedProduct.name}
            </h2>
            <p className="text-yellow-400 text-lg font-semibold my-2">
              Rs. {selectedProduct.price}
            </p>

            {/* Actions */}
            <div className="flex space-x-4 mt-4">
              <Link
                href={`/product/${selectedProduct.id}`}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black rounded font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
