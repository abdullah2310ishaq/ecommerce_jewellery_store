"use client";

import React, { useEffect, useState } from "react";
import Filters from "./product_components/Filters";
import ProductList from "./product_components/ProductList";

// Import your Firestore function to get all products
import { getAllProducts } from "../firebase/firebase_services/firestore";

/** Product interface (match your Firestore shape) */
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  img: string;
  rating?: number;
  material?: string;
  stone?: string;
  isOnSale?: boolean;
  description?: string;
}

export default function ProductsPage() {
  // ---------- State ----------
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State (mirrors the "Filters" component fields)
  const [filters, setFilters] = useState({
    category: "All",
    priceRange: 2000,
    material: "All",
    stone: "All",
    saleOnly: false,
    searchQuery: "",
  });

  // ---------- 1. Fetch all products from Firestore on mount ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts(); // fetch all
        // data is an array of docs
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---------- 2. Apply local filters to "products" ----------
  useEffect(() => {
    let result = [...products];

    // 1) Category Filter
    if (filters.category !== "All") {
      // Compare doc.category to filters.category
      result = result.filter(
        (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // 2) Price Filter
    result = result.filter((p) => p.price <= filters.priceRange);

    // 3) Material
    if (filters.material !== "All") {
      result = result.filter(
        (p) => p.material?.toLowerCase() === filters.material.toLowerCase()
      );
    }

    // 4) Stone
    if (filters.stone !== "All") {
      result = result.filter(
        (p) => p.stone?.toLowerCase() === filters.stone.toLowerCase()
      );
    }

    // 5) Sale Only
    if (filters.saleOnly) {
      result = result.filter((p) => p.isOnSale === true);
    }

    // 6) Search Query (by name or description)
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(result);
  }, [filters, products]);

  if (loading) {
    return (
      <section className="min-h-screen bg-black text-yellow-100 flex items-center justify-center">
        <p className="text-xl">Loading products...</p>
      </section>
    );
  }

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
            <Filters filters={filters} setFilters={setFilters} />
          </aside>

          {/* Right Section - Products Grid */}
          <div className="w-full md:w-3/4">
            <ProductList products={filteredProducts} />
          </div>
        </div>
      </div>
    </section>
  );
}
