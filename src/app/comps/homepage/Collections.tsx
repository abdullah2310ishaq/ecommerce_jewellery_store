"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';

// Import the Firestore function
import { getFeaturedCollections } from "../../firebase/firebase_services/firestore";

interface FirestoreCollection {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function Collections() {
  const [collections, setCollections] = useState<FirestoreCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const featured = await getFeaturedCollections();
        
        if (!featured || !Array.isArray(featured)) {
          throw new Error("Invalid data format received");
        }
        
        setCollections(featured as FirestoreCollection[]);
        setError(null);
      } catch (error) {
        console.error("Error fetching featured collections:", error);
        setError("Failed to load collections. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section with elegant typography */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium tracking-[0.2em] text-[#FB6F90] mb-3 uppercase"
          >
            Exquisite Selection
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6"
          >
            Featured Collections
          </motion.h3>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-24 h-0.5 mx-auto bg-gradient-to-r from-[#FB6F90]/60 via-[#FB6F90] to-[#FB6F90]/60"
          />
        </div>

        {/* Loading State with elegant animation */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FB6F90]"></div>
          </div>
        )}

        {/* Error State with refined styling */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <svg className="w-8 h-8 text-[#FB6F90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">{error}</h4>
            <button 
              onClick={() => {
                setLoading(true);
                setError(null);
                getFeaturedCollections()
                  .then(featured => {
                    setCollections(featured as FirestoreCollection[]);
                    setError(null);
                  })
                  .catch(err => {
                    console.error("Error retrying fetch:", err);
                    setError("Failed to load collections. Please try again later.");
                  })
                  .finally(() => setLoading(false));
              }}
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#FB6F90] hover:bg-[#FB6F90]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB6F90] transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State with refined design */}
        {!loading && !error && collections.length === 0 && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FB6F90]/10 mb-4">
              <svg className="w-8 h-8 text-[#FB6F90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-xl font-serif text-gray-900 mb-2">No Collections Found</h4>
            <p className="text-gray-500 mb-6">We are currently curating new collections. Please check back soon for our latest offerings.</p>
          </div>
        )}

        {/* Collections Grid with enhanced design and animations */}
        {!loading && !error && collections.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/products`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={collection.image || "/placeholder.jpg"}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h4 className="text-2xl md:text-3xl font-serif mb-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                      {collection.name}
                    </h4>
                    <p className="text-white/90 text-sm mb-4 line-clamp-2 transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                      {collection.description || `Discover our exquisite ${collection.name} collection`}
                    </p>
                    <div className="flex items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      <span className="text-sm font-medium mr-2">Explore Collection</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

     
      </div>
    </section>
  );
}
