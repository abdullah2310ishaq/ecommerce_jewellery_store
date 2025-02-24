"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { addToCart } from "@/app/cart/cart";
import { getProductById } from "@/app/firebase/firebase_services/firestore";

interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
  // other fields if needed
}

export default function ProductDetailPage() {
  const { id } = useParams(); // from the dynamic route /product/[id]
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return; // no ID yet
      try {
        setLoading(true);
        const resolvedId = Array.isArray(id) ? id[0] : id;
        const prod = await getProductById(resolvedId);
        console.log("Fetched product:", prod);
        if (prod) {
          setProduct(prod as FirestoreProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Product not found.</p>
      </div>
    );
  }

  // Show first image or fallback
  const mainImage = product.images?.[0] || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-black text-yellow-100 p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left: Product Image(s) */}
        <div className="flex-1">
          <div className="relative aspect-square mb-4">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover rounded"
            />
          </div>
          {/* If multiple images, show thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 border border-yellow-600">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-yellow-400">
            {product.name}
          </h1>
          <p className="text-lg text-yellow-300">
            ${product.price}
          </p>
          {product.description && (
            <p className="text-gray-200">{product.description}</p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart({ 
              id: product.id,
              name: product.name,
              price: product.price,
              image: mainImage, 
              quantity: 1 
            })}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-black rounded font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
