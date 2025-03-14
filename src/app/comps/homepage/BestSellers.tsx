"use client";

import { useEffect, useState } from "react";
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
  rating?: number;
}

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBestSellers();
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }
        setBestSellers(data as FirestoreProduct[]);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setError("Failed to load best sellers. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-sm font-medium tracking-wider text-[#FB6F90] px-4 py-2 bg-[#FB6F90]/10 rounded-full">
              CUSTOMER FAVORITES
            </span>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif text-gray-900 mb-6"
          >
            Best Sellers
          </motion.h3>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-24 h-0.5 mx-auto bg-gradient-to-r from-[#FB6F90]/60 via-[#FB6F90] to-[#FB6F90]/60"
          />
        </div>

        {/* Products Grid */}
        {!loading && !error && bestSellers.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {bestSellers.map((product) => {
              const basePrice = product.price;
              const salePrice = basePrice - 200; // Apply Rs. 200 discount

              return (
                <motion.div
                  key={product.id}
                  className="group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Best Seller Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-[#FB6F90] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Best Seller
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <Image
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick View Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/product/${product.id}`} passHref>
                        <motion.button
                          className="px-4 py-2 bg-white text-[#FB6F90] rounded-full font-medium flex items-center gap-1 shadow-md"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                          Quick View
                        </motion.button>
                      </Link>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-900 truncate group-hover:text-[#FB6F90] transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="mt-1">
                      <p className="text-gray-500 text-sm line-through">Rs. {basePrice.toLocaleString()}</p>
                      <p className="font-semibold text-lg md:text-xl text-[#FB6F90]">
                        Rs. {salePrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View All Button */}
        {!loading && !error && bestSellers.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/product"
              className="inline-flex items-center px-8 py-3 bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded-full font-medium tracking-wide transition-all duration-300 group hover:shadow-lg"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
