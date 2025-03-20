"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../firebase/firebase_services/firestore";
import ProductList, { Product } from "./product_components/ProductList";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function to ensure stability
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllProducts();
      console.log("Fetched all products:", all);
      setProducts(all as Product[]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <p>Loading products...</p>
      </div>
    );
  }

  return <ProductList products={products} />;
}
