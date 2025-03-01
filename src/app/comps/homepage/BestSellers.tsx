"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Eye, ArrowRight } from "lucide-react";
import { getBestSellers } from "../../firebase/firebase_services/firestore";

interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center text-gray-900">
          <h2>Loading Best Sellers...</h2>
        </div>
      </section>
    );
  }

  if (!bestSellers.length) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center text-gray-900">
          <h2>No best sellers found.</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-light tracking-[0.3em] text-[#FB6F90] mb-4">
            CUSTOMER FAVORITES
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
            Best Sellers
          </h3>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-[#FB6F90] via-[#FB6F90] to-[#FB6F90]" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <motion.div
              key={product.id}
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg overflow-hidden border-2 border-[#FB6F90]/30 hover:border-[#FB6F90] transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-[#FB6F90]/20 filter blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

              {/* Best Seller Badge */}
              <motion.div
                className="absolute top-3 left-3 z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <span className="bg-[#FB6F90] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Best Seller
                </span>
              </motion.div>

              {/* Product Image */}
              <div className="relative overflow-hidden aspect-square">
                <Image
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-4">
                <h3 className="text-xl font-bold text-[#FB6F90] truncate">
                  {product.name}
                </h3>
                <p className="font-semibold text-2xl mt-1 text-[#FB6F90]">
                  Rs. {product.price}
                </p>

                {/* Action Button */}
                <motion.div
                  className="pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link href={`/product/${product.id}`} passHref>
                    <motion.button
                      className="w-full px-4 py-2 bg-[#FB6F90] text-white rounded-md font-medium flex items-center justify-center gap-2 group relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">View Details</span>
                      <Eye className="w-5 h-5 relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-[#FB6F90]/80"
                        initial={{ x: "100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ type: "tween" }}
                      />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              {/* Hover Effect Overlay */}
              <motion.div
                className="absolute inset-0 bg-[#FB6F90]/10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/product"
            className="inline-flex items-center px-8 py-3 bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded-full font-medium tracking-wide transition-colors group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
