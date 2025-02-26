"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Filter, X, Gem, Grid3X3, List, Star} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Firestore function to get all collections
import { getAllCollections } from "../firebase/firebase_services/firestore"

// Adjust interface if your docs store "image" or multiple images
interface CollectionItem {
  id: string
  name: string
  description?: string
  longDescription?: string
  image?: string
  price?: number
  rating?: number
  new?: boolean
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [filteredCollections, setFilteredCollections] = useState<CollectionItem[]>([])

  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  // New state for animation
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all collections
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const data = await getAllCollections()
        setCollections(data as CollectionItem[])
      } catch (err) {
        console.error("Error fetching Firestore collections:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle scroll for back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  // Filter + Sort
  useEffect(() => {
    let filtered = collections.filter((item) => {
      const matchSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSearch
    })

    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
        break
      case "price-low":
        filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-high":
        filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "rating":
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        break
    }

    setFilteredCollections(filtered)
  }, [collections, searchQuery, sortBy])

  // Reusable Card
  const CollectionCard = ({
    collection,
    mode,
  }: {
    collection: CollectionItem
    mode: string
  }) => {
    const isActive = activeCollection === collection.id

    const toggleActive = () => {
      setActiveCollection(isActive ? null : collection.id)
    }

    if (mode === "grid") {
      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="group relative rounded-xl overflow-hidden bg-gray-800/20 hover:bg-gray-800/30 transition-colors"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              fill
              className="object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            {collection.new && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-600/90 rounded-full text-sm font-medium shadow">
                New Arrival
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-serif bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {collection.name}
            </h3>
            <p className="text-gray-400 line-clamp-3">{collection.description}</p>

            <div className="flex items-center justify-between">
              {collection.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-medium">{collection.rating.toFixed(1)}</span>
                </div>
              )}

              {collection.price && <span className="text-yellow-400 font-light">From ${collection.price}</span>}
            </div>

            <Link
              href={`/product?category=${encodeURIComponent(collection.name)}`}
              className="w-full block text-center py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      )
    } else {
      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="group flex flex-col md:flex-row gap-8 rounded-xl overflow-hidden bg-gray-800/20 hover:bg-gray-800/30 transition-colors"
        >
          <div className="relative w-full md:w-80 aspect-video md:aspect-auto overflow-hidden">
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              fill
              className="object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            {collection.new && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-600/90 rounded-full text-sm font-medium shadow">
                New Arrival
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
            <h3 className="text-2xl font-serif bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {collection.name}
            </h3>
            <p className="text-gray-400">{collection.description}</p>

            <div className="flex items-center justify-between">
              {collection.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-medium">{collection.rating.toFixed(1)}</span>
                </div>
              )}

              {collection.price && <span className="text-yellow-400 font-light">From ${collection.price}</span>}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/product?category=${encodeURIComponent(collection.name)}`}
                className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition"
              >
                Explore Collection
              </Link>
              {/* <button
                  type="button"
                  title={isActive ? "Show less information" : "Show more information"}
                  onClick={toggleActive}
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {isActive ? "Less Info" : "More Info"}
                {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button> */}
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-300 mt-4">{collection.longDescription}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg"
          alt="Collections Hero"
          fill
          className="object-cover object-center"
          priority
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 text-center space-y-6 max-w-3xl px-4"
        >
          <h1 className="text-5xl md:text-7xl font-serif bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            Timeless Collections
          </h1>
          <p className="text-xl text-gray-300">Where heritage meets contemporary luxury</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-4 bg-yellow-600/90 hover:bg-yellow-500/90 rounded-full transition-all overflow-hidden"
          >
            <span className="absolute inset-0 bg-yellow-500/40 rounded-full blur-lg opacity-50 animate-pulse" />
            <span className="relative font-medium">Discover Our Latest Pieces</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Top Bar (Sort, Search, etc.) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 bg-black/70 backdrop-blur-md border-b border-gray-800"
      >
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            {showFilters ? "Close Filters" : "Filters"}
          </button>

          <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-yellow-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-yellow-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 bg-gray-800 rounded-lg pl-10 focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Drop-Down Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/80 backdrop-blur-md border-b border-gray-800 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6">
              <p className="text-gray-200">No additional filters right now.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : filteredCollections.length > 0 ? (
          <motion.div
            layout
            className={`grid gap-8 ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            <AnimatePresence>
              {filteredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} mode={viewMode} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400">
            No matching collections found.
          </motion.p>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-4 bg-yellow-600 rounded-full text-white shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 z-50"
            aria-label="Scroll to top"
          >
            <Gem className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

