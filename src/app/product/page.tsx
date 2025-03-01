"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "../firebase/firebase_services/firestore";
import ProductList, { Product } from "./product_components/ProductList";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1) Fetch all products from Firestore
        const all = await getAllProducts();
        console.log("Fetched all products:", all);

        // 2) Convert them to our local Product type
        setProducts(all as Product[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <p>Loading products...</p>
      </div>
    );
  }

  return <ProductList products={products} />;
}
