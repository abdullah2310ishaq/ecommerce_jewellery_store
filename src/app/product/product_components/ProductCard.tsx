"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Eye } from "lucide-react"

export interface Product {
  id: string
  name: string
  price: number
  images?: string[]
  description?: string
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const [, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get the first image or use placeholder
  const imageUrl = product.images?.[0] || "/placeholder.svg"

  // Log image URL for debugging
  useEffect(() => {
    console.log(`ProductCard for ${product.id} - Image URL:`, imageUrl)
  }, [product.id, imageUrl])

  // Apply Rs. 200 discount on all products
  const basePrice = product.price
  const salePrice = basePrice - 200

  const handleImageError = () => {
    console.error(`Image failed to load for product ${product.id} in ProductCard`)
    setImageError(true)
  }

  // Grid mode card
  if (viewMode === "grid") {
    return (
      <motion.div
        className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-[#FB6F90] hover:shadow-lg transition-all duration-300 group h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Sale Badge (Always Visible) */}
        <motion.div
          className="absolute top-2 right-2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <span className="bg-[#FB6F90] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sale
          </span>
        </motion.div>

        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square">
          <Image
            src={imageError ? "/placeholder.svg" : imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            onError={handleImageError}
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
            <p className="text-gray-500 text-sm line-through">Rs. {basePrice.toFixed(2)}</p>
            <p className="font-semibold text-lg md:text-xl text-[#FB6F90]">Rs. {salePrice.toFixed(2)}</p>
          </div>

          {/* Action Button */}
          <Link href={`/product/${product.id}`}>
            <motion.button
              className="w-full mt-2 px-3 py-1.5 bg-white text-[#FB6F90] border border-[#FB6F90] rounded-md font-medium flex items-center justify-center gap-1.5 group-hover:bg-[#FB6F90] group-hover:text-white transition-colors duration-300"
              whileTap={{ scale: 0.97 }}
            >
              <span>View Details</span>
              <Eye className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    )
  }

  // List mode card
  return (
    <motion.div
      className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-[#FB6F90] hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Sale Badge (Always Visible) */}
        <motion.div
          className="absolute top-2 left-2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <span className="bg-[#FB6F90] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sale
          </span>
        </motion.div>

        {/* Product Image */}
        <div className="relative overflow-hidden sm:w-1/3">
          <div className="aspect-square sm:aspect-[4/3]">
            <Image
              src={imageError ? "/placeholder.svg" : imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              onError={handleImageError}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Details */}
        <div className="p-4 sm:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#FB6F90] transition-colors">
              {product.name}
            </h3>

            <div className="flex flex-col mt-2">
              <p className="text-gray-500 text-sm line-through">Rs. {basePrice.toFixed(2)}</p>
              <p className="font-medium text-2xl text-[#FB6F90]">Rs. {salePrice.toFixed(2)}</p>
            </div>

            <p className="text-gray-600 mt-2 line-clamp-2">
              {product.description || "Beautiful jewelry piece crafted with precision and care."}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <Link href={`/product/${product.id}`}>
              <motion.button
                className="px-4 py-2 bg-white text-[#FB6F90] border border-[#FB6F90] rounded-md font-medium flex items-center justify-center gap-2 group-hover:bg-[#FB6F90] group-hover:text-white transition-colors duration-300 max-w-xs"
                whileTap={{ scale: 0.97 }}
              >
                <span>View Details</span>
                <Eye className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard

