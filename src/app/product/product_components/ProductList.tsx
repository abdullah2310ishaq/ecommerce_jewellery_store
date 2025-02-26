"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "./ProductCard"
import Pagination from "./Pagination"
import { ChevronDown, ChevronUp, Filter, Grid, List } from "lucide-react"

export interface Product {
  id: string
  name: string
  price: number
  images?: string[]
  rating?: number
  isOnSale?: boolean
  category?: string
}

interface ProductListProps {
  products: Product[]
}

const itemsPerPage = 6

export default function ProductList({ products }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  useEffect(() => {
    setHasLoaded(true)
  }, [])

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const sortedAndFilteredProducts = products
    .filter((p) => !filterCategory || p.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
      return 0
    })

  if (sortOrder === "desc") sortedAndFilteredProducts.reverse()

  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage)
  const displayedProducts = sortedAndFilteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <section className="bg-gradient-to-b from-gray-900 to-black text-yellow-100 py-12 px-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Section Heading */}
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-8 text-center"
        >
          Our Exclusive Jewelry Collection
        </motion.h2>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-between items-center mb-8 gap-4"
        >
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-yellow-600 text-black" : "bg-gray-800"}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-yellow-600 text-black" : "bg-gray-800"}`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "price" | "rating")}
              className="bg-gray-800 rounded p-2"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 bg-gray-800 rounded"
            >
              {sortOrder === "asc" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} />
            <select
              value={filterCategory || ""}
              onChange={(e) => setFilterCategory(e.target.value || null)}
              className="bg-gray-800 rounded p-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Check if no products at all */}
        {sortedAndFilteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-300 mt-8"
          >
            <p className="text-xl">No products found.</p>
          </motion.div>
        ) : (
          <>
            {/* Product Grid/List */}
            <motion.div
              layout
              className={`grid gap-8 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              <AnimatePresence>
                {displayedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls (only if there's at least one product) */}
            {displayedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-10 flex justify-center"
              >
                <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </section>
  )
}

