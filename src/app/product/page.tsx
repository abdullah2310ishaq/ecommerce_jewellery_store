"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getAllProducts, getAllCollections, getProductsByCollection } from "@/app/firebase/firebase_services/firestore"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, X, ChevronDown } from "lucide-react"
import Image from "next/image"
import ProductList from "./product_components/ProductList"

// Define the Product interface to match what's expected by ProductList
interface Product {
  id: string
  name: string
  price: number
  collectionId: string
  images?: string[]
  rating?: number
  isOnSale?: boolean
}

// Define a base product interface for the raw data from Firebase
interface RawProductData {
  id: string
  name: string
  price: number
  images?: string[]
  rating?: number
  isOnSale?: boolean
  collection?: string
  collectionId?: string
  [key: string]: unknown // For any other properties that might exist
}

// Define the Collection interface for better type safety
interface Collection {
  id: string
  name: string
  image?: string
  description?: string
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const collectionParam = searchParams.get("collection")

  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null)

  // Set initial collection from URL parameter
  useEffect(() => {
    if (collectionParam) {
      setSelectedCollections([collectionParam])
    } else {
      setSelectedCollections([])
      setActiveCollection(null)
    }
  }, [collectionParam])

  // Fetch collections and products
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch all collections
        const collectionsData = await getAllCollections()
        const typedCollections = collectionsData as Collection[]
        setCollections(typedCollections)

        // If we have a collection from URL, find its details
        if (collectionParam && typedCollections.length > 0) {
          const foundCollection = typedCollections.find((c) => c.id === collectionParam)
          if (foundCollection) {
            // Make sure we're setting a complete Collection object
            setActiveCollection(foundCollection)
          }
        }

        // Fetch products based on filter or all products
        let productsData
        if (selectedCollections.length > 0) {
          // If collections are selected, fetch products for those collections
          const productPromises = selectedCollections.map((collectionId) => getProductsByCollection(collectionId))
          const productsArrays = await Promise.all(productPromises)

          // Combine and deduplicate products from different collections
          const combinedProducts = productsArrays.flat()
          const uniqueProducts = Array.from(new Map(combinedProducts.map((item) => [item.id, item])).values())
          productsData = uniqueProducts
        } else {
          // If no collections selected, fetch all products
          productsData = await getAllProducts()
        }

        // Ensure the products have the required collectionId property
        const typedProducts = (productsData as RawProductData[]).map((product) => {
          // If product doesn't have collectionId, add it from its collection
          if (!product.collectionId && product.collection) {
            return { ...product, collectionId: product.collection } as Product
          }
          // If neither exists, use an empty string as fallback
          if (!product.collectionId && !product.collection) {
            return { ...product, collectionId: "" } as Product
          }
          return product as Product
        })

        setProducts(typedProducts)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCollections, collectionParam])

  // Toggle collection selection and update URL
  const toggleCollection = (collectionId: string) => {
    // If already selected, clear it
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections([])
      setActiveCollection(null)
      router.push("/product")
    } else {
      // Otherwise select only this collection
      setSelectedCollections([collectionId])

      // Find and set the active collection for display purposes
      const collection = collections.find((c) => c.id === collectionId)
      if (collection) {
        // Make sure we're setting a complete Collection object with all required properties
        setActiveCollection(collection)
      }

      // Update URL with the selected collection
      router.push(`/product?collection=${collectionId}`)
    }
  }

  // Clear all collection filters and update URL
  const clearCollectionFilters = () => {
    setSelectedCollections([])
    setActiveCollection(null)
    router.push("/product")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB6F90] mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {activeCollection ? activeCollection.name : "Our Products"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {activeCollection?.description || "Browse our collection of beautiful jewelry pieces"}
          </p>
        </motion.div>

        {/* Collection Filter Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Collections</h2>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:border-[#FB6F90] transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Mobile Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-white p-4 rounded-lg shadow-md mb-4 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => toggleCollection(collection.id)}
                      className={`flex flex-col items-center p-3 rounded-lg border ${
                        selectedCollections.includes(collection.id)
                          ? "border-[#FB6F90] bg-[#FB6F90]/5"
                          : "border-gray-200 hover:border-[#FB6F90]/50"
                      } transition-all`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 mb-2 overflow-hidden">
                        {collection.image ? (
                          <Image
                            src={collection.image || "/placeholder.svg?height=48&width=48"}
                            alt={collection.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#FB6F90]/10 text-[#FB6F90]">
                            {collection.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          selectedCollections.includes(collection.id) ? "text-[#FB6F90]" : "text-gray-700"
                        }`}
                      >
                        {collection.name}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedCollections.length > 0 && (
                  <button
                    onClick={clearCollectionFilters}
                    className="mt-4 w-full py-2 text-sm text-[#FB6F90] hover:text-[#d85476] flex items-center justify-center gap-1 border border-dashed border-[#FB6F90]/30 rounded-md hover:bg-[#FB6F90]/5"
                  >
                    <X size={14} />
                    <span>Clear filters</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Collection Cards - Always visible on desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {collections.map((collection) => (
                <motion.div
                  key={collection.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => toggleCollection(collection.id)}
                  className={`cursor-pointer rounded-lg overflow-hidden shadow-sm ${
                    selectedCollections.includes(collection.id) ? "ring-2 ring-[#FB6F90]" : "hover:shadow-md"
                  } transition-all`}
                >
                  <div className="relative h-32 bg-gray-100">
                    {collection.image ? (
                      <Image
                        src={collection.image || "/placeholder.svg?height=128&width=256"}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FB6F90]/20 to-[#FB6F90]/5 flex items-center justify-center">
                        <span className="text-[#FB6F90] text-2xl font-light">{collection.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-3 w-full">
                        <h3 className="text-white font-medium text-sm">{collection.name}</h3>
                      </div>
                    </div>
                    {selectedCollections.includes(collection.id) && (
                      <div className="absolute top-2 right-2 bg-[#FB6F90] text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedCollections.length > 0 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={clearCollectionFilters}
                  className="px-4 py-2 text-sm text-[#FB6F90] hover:text-[#d85476] flex items-center gap-1 border border-[#FB6F90]/30 rounded-full hover:bg-[#FB6F90]/5 transition-colors"
                >
                  <X size={14} />
                  <span>Clear collection filters</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {selectedCollections.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCollections.map((collectionId) => {
                const collection = collections.find((c) => c.id === collectionId)
                return collection ? (
                  <span
                    key={collectionId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FB6F90]/10 text-[#FB6F90]"
                  >
                    {collection.name}
                    <button
                      onClick={() => toggleCollection(collectionId)}
                      className="ml-1 text-[#FB6F90] hover:text-[#d85476]"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ) : null
              })}
            </div>
          </motion.div>
        )}

        {/* Product List Component */}
        <ProductList products={products} />
      </div>
    </div>
  )
}

