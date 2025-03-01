"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, Eye, ArrowRight } from "lucide-react"
import { getBestSellers } from "../../firebase/firebase_services/firestore"

interface FirestoreProduct {
  id: string
  name: string
  price: number
  images?: string[]
  rating?: number
}

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<FirestoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBestSellers()
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format received")
        }
        setBestSellers(data as FirestoreProduct[])
      } catch (error) {
        console.error("Error fetching best sellers:", error)
        setError("Failed to load best sellers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with animated elements */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-sm font-medium tracking-wider text-[#FB6F90] px-4 py-2 bg-[#FB6F90]/10 rounded-full mb-4">
              CUSTOMER FAVORITES
            </span>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6"
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FB6F90]"></div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <svg className="w-8 h-8 text-[#FB6F90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">{error}</h4>
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                getBestSellers()
                  .then((data) => {
                    setBestSellers(data as FirestoreProduct[])
                    setError(null)
                  })
                  .catch((err) => {
                    console.error("Error retrying fetch:", err)
                    setError("Failed to load best sellers. Please try again later.")
                  })
                  .finally(() => setLoading(false))
              }}
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#FB6F90] hover:bg-[#FB6F90]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB6F90] transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid with enhanced animations and responsiveness */}
        {!loading && !error && bestSellers.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {bestSellers.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Animated Spotlight Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FB6F90]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Best Seller Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#FB6F90] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Best Seller
                  </span>
                </div>

                {/* Product Image with Hover Zoom */}
                <div className="relative overflow-hidden aspect-square">
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info with Animated Reveal */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-[#FB6F90] transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-2xl text-[#FB6F90]">Rs. {product.price.toLocaleString()}</p>
                    <div className="flex items-center">
                    
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/product/${product.id}`} passHref>
                      <motion.button
                        className="w-full px-4 py-3 bg-[#FB6F90] text-white rounded-full font-medium flex items-center justify-center gap-2 group relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">View Details</span>
                        <Eye className="w-5 h-5 relative z-10" />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#FB6F90] via-pink-500 to-[#FB6F90]"
                          initial={{ x: "100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ type: "tween" }}
                        />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button with enhanced animation */}
        {!loading && !error && bestSellers.length > 0 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/product"
              className="inline-flex items-center px-8 py-3 bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded-full font-medium tracking-wide transition-all duration-300 group hover:shadow-lg hover:scale-105"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

