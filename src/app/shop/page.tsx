"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Filter, X, Gem, Grid3X3, List, Star } from "lucide-react";

// Firestore function to get all collections
import { getAllCollections } from "../firebase/firebase_services/firestore";

// Adjust interface if your docs store "image" or multiple images
interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  image?: string;
  // We'll assume each collection doc has a "name" that matches the category for products
  price?: number;
  rating?: number;
  reviews?: number;
  new?: boolean;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionItem[]>([]);

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // For "Scroll to Top" button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch all collections
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCollections();
        setCollections(data as CollectionItem[]);
      } catch (err) {
        console.error("Error fetching Firestore collections:", err);
      }
    }
    fetchData();
  }, []);

  // Handle scroll for back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Filter + Sort
  useEffect(() => {
    let filtered = collections.filter((item) => {
      const matchSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });

    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case "price-low":
        filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      // featured -> no special sort
      default:
        break;
    }

    setFilteredCollections(filtered);
  }, [collections, searchQuery, sortBy]);

  // Reusable Card
  const CollectionCard = ({ collection, mode }: { collection: CollectionItem; mode: string }) => {
    if (mode === "grid") {
      return (
        <div className="group relative bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              fill
              className="object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            {collection.new && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-600/90 rounded-full text-sm font-medium">
                New Arrival
              </div>
            )}
          </div>

          <div className="p-8 space-y-4">
            <h3 className="text-2xl font-serif mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {collection.name}
            </h3>
            <p className="text-gray-400">{collection.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-gray-300">{collection.rating || 0}</span>
              </div>
              {collection.price && (
                <span className="text-yellow-400 font-light">
                  From ${collection.price}
                </span>
              )}
            </div>

            {/* 
              Link to products page, passing the collection's name as ?category=... 
              Make sure your product docs also have product.category === collection.name
            */}
            <Link
              href={`/product?category=${encodeURIComponent(collection.name)}`}
              className="w-full block text-center py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      );
    } else {
      // List view
      return (
        <div className="group flex gap-8 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden">
          <div className="relative w-80 overflow-hidden">
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              fill
              className="object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            {collection.new && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-600/90 rounded-full text-sm font-medium">
                New Arrival
              </div>
            )}
          </div>

          <div className="flex-1 py-8 pr-8 space-y-4">
            <h3 className="text-2xl font-serif mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {collection.name}
            </h3>
            <p className="text-gray-400">{collection.description}</p>
            <p className="text-sm text-gray-300">{collection.longDescription}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-300">
                    {collection.rating || 0} ({collection.reviews || 0} reviews)
                  </span>
                </div>
                {collection.price && (
                  <span className="text-yellow-400 font-light">
                    From ${collection.price}
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/products?category=${encodeURIComponent(collection.name)}`}
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden z-10">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg"
          alt="Collections Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center space-y-8 max-w-4xl px-6">
            <h1 className="text-5xl md:text-7xl font-serif bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
              Timeless Collections
            </h1>
            <p className="text-xl text-gray-300">
              Where heritage meets contemporary luxury
            </p>
            <button className="relative px-8 py-4 bg-yellow-600/90 hover:bg-yellow-500/90 rounded-full transition-all transform hover:scale-105 overflow-hidden">
              <span className="absolute inset-0 bg-yellow-500/30 rounded-full blur-xl opacity-70 animate-pulse" />
              <span className="relative">Discover Our Latest Pieces</span>
            </button>
          </div>
        </div>
      </div>

      {/* (Optional) Wave SVG, etc. */}
      <div className="relative overflow-hidden -mt-1">
        <svg
          className="block w-full h-[80px] md:h-[120px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#0f0f0f"
            fillOpacity="1"
            d="M0,128L80,112C160,96,320,64,480,53.3C640,43,800,53,960,85.3C1120,117,1280,171,1360,197.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
      </div>

      {/* Top Bar (Sort, Search) */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Filters Button (optional) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            {showFilters ? "Close Filters" : "Filters"}
          </button>

          {/* View Mode Toggle */}
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

          {/* Sorting & Search */}
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
      </div>

      {/* (Optional) Filter Drop-Down Section */}
      {showFilters && (
        <div className="bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto px-6 py-6">
            {/* Placeholder for advanced filters if you want them */}
            <p className="text-gray-200">No additional filters right now.</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} mode={viewMode} />
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 bg-yellow-600 rounded-full text-white shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <Gem className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
