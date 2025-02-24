"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";

// Adjust your import to the correct path
import { getBestSellers } from "../../firebase/firebase_services/firestore";

// If your FirestoreProduct has an array of images, define it here
interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  images?: string[]; // array of images
}

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBestSellers();
        setBestSellers(data as FirestoreProduct[]);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6 text-center text-white">
          <h2>Loading Best Sellers...</h2>
        </div>
      </section>
    );
  }

  if (!bestSellers.length) {
    return (
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6 text-center text-white">
          <h2>No best sellers found.</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-light tracking-[0.3em] text-yellow-400 mb-4">
            CUSTOMER FAVORITES
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Best Sellers
          </h3>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <Link
              key={product.id}
              href={`/shop?product=${product.id}`}
              className="group bg-gray-900 rounded-lg overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  // ONLY show first image in array
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                />

                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 rounded-full">
                  <span className="text-yellow-400 font-medium">Rs.{product.price}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Example rating display (static 5 stars if you wish) */}
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Name */}
                <h4 className="text-xl font-medium text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {product.name}
                </h4>

                {/* Action Button */}
                <div className="mt-4 flex items-center text-yellow-400 text-sm font-medium group/button">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover/button:translate-x-2 transition-transform" />
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-full font-medium tracking-wide transition-colors group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
