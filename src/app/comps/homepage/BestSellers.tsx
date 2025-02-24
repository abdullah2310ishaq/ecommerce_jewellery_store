"use client";

import React, { useEffect, useState } from "react";
import { getBestSellers } from "../../firebase/firebase_services/firestore";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  price: number; // Changed to number for consistency
  rating?: number; // Made optional
  img: string;
  url?: string; // Made optional
}

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBestSellers();
        setBestSellers(data as ProductItem[]);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-24 text-gray-200">Loading best sellers...</div>
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
              href={product.url || `/shop?product=${product.id}`}
              className="group bg-gray-900 rounded-lg overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                />

                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 rounded-full">
                  <span className="text-yellow-400 font-medium">Rs.{product.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(product.rating || 0)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
};

export default BestSellers;
