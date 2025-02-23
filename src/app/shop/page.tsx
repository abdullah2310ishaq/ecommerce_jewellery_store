"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Star, Grid3X3, List, Heart, X } from "lucide-react"
import Image from "next/image"

const CollectionsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [priceFilter, setPriceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCollections, setFilteredCollections] = useState([])

  const collections = [
    {
      id: 1,
      name: "Celestial Diamond Collection",
      description: "Where starlight meets elegance in perfectly cut diamonds.",
      longDescription:
        "Inspired by the night sky, each piece captures the ethereal beauty of the cosmos. Features rare blue and white diamonds set in innovative floating designs.",
      img: "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg",
      category: "rings",
      featured: true,
      price: 3999,
      priceRange: "luxury",
      rating: 4.9,
      reviews: 128,
      pieces: 24,
      new: true,
    },
    {
      id: 2,
      name: "Royal Gold Heritage",
      description: "24K gold masterpieces inspired by royal treasures.",
      longDescription:
        "Each piece tells a story of ancient craftsmanship reimagined for modern royalty. Featuring intricate filigree work and rare colored diamonds.",
      img: "https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg",
      category: "necklaces",
      featured: true,
      price: 2899,
      priceRange: "premium",
      rating: 4.0,
      reviews: 96,
      pieces: 18,
    },
    {
      id: 3,
      name: "Modern Platinum Elite",
      description: "Contemporary designs in pure platinum.",
      longDescription:
        "Minimalist elegance meets maximum impact in this modern collection. Each piece showcases the unique properties of platinum.",
      img: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg",
      category: "bracelets",
      featured: false,
      price: 3499,
      priceRange: "luxury",
      rating: 4.7,
      reviews: 84,
      pieces: 16,
    },
    {
      id: 4,
      name: "Pearl Luminescence",
      description: "Rare pearls in contemporary settings.",
      longDescription:
        "South Sea and Tahitian pearls meet modern design sensibilities in this unique collection. Each pearl is carefully selected for its exceptional lustre.",
      img: "https://images.pexels.com/photos/15785515/pexels-photo-15785515.jpeg",
      category: "earrings",
      featured: true,
      price: 2699,
      priceRange: "premium",
      rating: 4.9,
      reviews: 112,
      pieces: 22,
      new: true,
    },
  ]

  const categories = [
    { id: "all", name: "All Collections", count: collections.length },
    { id: "rings", name: "Rings", count: collections.filter((c) => c.category === "rings").length },
    { id: "necklaces", name: "Necklaces", count: collections.filter((c) => c.category === "necklaces").length },
    { id: "bracelets", name: "Bracelets", count: collections.filter((c) => c.category === "bracelets").length },
    { id: "earrings", name: "Earrings", count: collections.filter((c) => c.category === "earrings").length },
  ]

  useEffect(() => {
    const filtered = collections.filter((collection) => {
      const matchesCategory = selectedCategory === "all" || collection.category === selectedCategory
      const matchesSearch =
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

    let sorted = [...filtered]
    switch (sortBy) {
      case "newest":
        sorted = sorted.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
        break
      case "price-low":
        sorted = sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted = sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted = sorted.sort((a, b) => b.rating - a.rating)
        break
      // 'featured' is default, no need to sort
    }

    setFilteredCollections(sorted)
  }, [selectedCategory, searchQuery, sortBy])

  const CollectionCard = ({ collection, mode }) => {
    const [isWishlisted, setIsWishlisted] = useState(false)

    return mode === "grid" ? (
      <div className="group relative bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={collection.img || "/placeholder.svg"}
            alt={collection.name}
            layout="fill"
            objectFit="cover"
            className="transform transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-4 right-4 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>

          {collection.new && (
            <div className="absolute top-4 left-4 px-4 py-2 bg-blue-600/90 rounded-full text-sm font-medium">
              New Arrival
            </div>
          )}
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-serif mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {collection.name}
            </h3>
            <p className="text-gray-400">{collection.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-gray-300">{collection.rating}</span>
              </div>
              <span className="text-blue-400 font-light">From ${collection.price}</span>
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg transition-all duration-300 transform hover:scale-[1.02]">
            Explore Collection
          </button>
        </div>
      </div>
    ) : (
      <div className="group flex gap-8 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
        <div className="relative w-80 overflow-hidden">
          <Image
            src={collection.img || "/placeholder.svg"}
            alt={collection.name}
            layout="fill"
            objectFit="cover"
            className="transform transition-transform duration-700 group-hover:scale-105"
          />
          {collection.new && (
            <div className="absolute top-4 left-4 px-4 py-2 bg-blue-600/90 rounded-full text-sm font-medium">
              New Arrival
            </div>
          )}
        </div>

        <div className="flex-1 py-8 pr-8 space-y-6">
          <div>
            <h3 className="text-2xl font-serif mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {collection.name}
            </h3>
            <p className="text-gray-400">{collection.description}</p>
          </div>

          <p className="text-sm text-gray-300">{collection.longDescription}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-gray-300">
                  {collection.rating} ({collection.reviews} reviews)
                </span>
              </div>
              <span className="text-blue-400 font-light">From ${collection.price}</span>
            </div>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 rounded-full hover:bg-gray-800/50 transition-all"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
          </div>

          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg transition-all duration-300 transform hover:scale-[1.02]">
            Explore Collection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900/20 to-black text-gray-100">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg"
          alt="Collections Hero"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center space-y-8 max-w-4xl px-6">
            <h1 className="text-5xl md:text-7xl font-serif bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Timeless Collections
            </h1>
            <p className="text-xl text-gray-300">Where heritage meets contemporary luxury</p>
            <button className="px-8 py-4 bg-blue-600/90 hover:bg-blue-700/90 rounded-full transition-all transform hover:scale-105">
              Discover Our Latest Pieces
            </button>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
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
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="w-64 px-4 py-2 bg-gray-800 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div
        className={`bg-gray-900/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${showFilters ? "max-h-96 py-6" : "max-h-0 overflow-hidden"}`}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center justify-between px-6 py-4 rounded-lg transition-all ${
                  selectedCategory === category.id ? "bg-blue-600" : "bg-gray-800/50 hover:bg-gray-700/50"
                }`}
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-400">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container mx-auto px-6 py-12">
        <div
          className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1"}`}
        >
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} mode={viewMode} />
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-6 py-24 bg-gradient-to-b from-blue-900/90 to-blue-800/90 rounded-xl text-center text-gray-100">
        <h2 className="text-3xl font-serif mb-4">Stay Updated on New Arrivals</h2>
        <p className="text-xl mb-6">
          Sign up for our newsletter to receive exclusive offers and early access to new collections.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="px-6 py-3 bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-4">&copy; 2025 Timeless Collections. All Rights Reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CollectionsPage

