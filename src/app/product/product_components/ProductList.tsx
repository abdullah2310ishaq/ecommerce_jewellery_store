"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Star, Heart } from "lucide-react"
import Pagination from "./Pagination"

interface Product {
  id: string
  name: string
  price: number
  collectionId: string
  images?: string[]
  rating?: number
  isOnSale?: boolean
}

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Update pagination when products change
  useEffect(() => {
    // Reset to page 1 when products array changes
    setCurrentPage(1)

    // Calculate total pages
    const calculatedTotalPages = Math.ceil(products.length / productsPerPage)
    setTotalPages(calculatedTotalPages)

    // Get initial page of products
    const indexOfLastProduct = 1 * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    setPaginatedProducts(products.slice(indexOfFirstProduct, indexOfLastProduct))
  }, [products, productsPerPage])

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)

    const indexOfLastProduct = pageNumber * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    setPaginatedProducts(products.slice(indexOfFirstProduct, indexOfLastProduct))

    // Scroll to top of product list
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Animation variants for product cards
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-600">Try selecting a different collection or clearing your filters.</p>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {paginatedProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants} className="group">
            <Link href={`/product/${product.id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative h-64 bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=256&width=256"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}

                  {/* Sale badge */}
                  {product.isOnSale && (
                    <div className="absolute top-2 left-2 bg-[#FB6F90] text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart size={18} className="text-gray-600 hover:text-[#FB6F90]" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>

                  {/* Rating stars */}
                  {product.rating && (
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="mt-12">
        <Pagination totalPages={totalPages} onPageChange={handlePageChange} currentPageProp={currentPage} />
      </div>
    </div>
  )
}

