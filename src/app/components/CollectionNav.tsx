"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Layers } from "lucide-react"
import { getAllCollections } from "@/app/firebase/firebase_services/firestore"
import Image from "next/image"

interface Collection {
  id: string
  name: string
  image?: string
}

export default function CollectionDropdown() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true)
        const collectionsData = await getAllCollections()
        setCollections(collectionsData as Collection[])
      } catch (error) {
        console.error("Error fetching collections:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        className="relative py-2 px-3 text-gray-700 font-medium text-sm tracking-wide flex items-center gap-1 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        Collections
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-[#FB6F90] w-0 group-hover:w-full transition-all duration-300"
          initial={{ width: "0%" }}
          animate={{ width: isOpen ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-2 max-h-[400px] overflow-y-auto">
              <Link
                href="/product"
                className="flex items-center gap-3 p-3 hover:bg-[#FB6F90]/5 rounded-md transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-[#FB6F90]/10 flex items-center justify-center">
                  <Layers size={16} className="text-[#FB6F90]" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-[#FB6F90] transition-colors">
                  All Collections
                </span>
              </Link>

              <div className="h-px bg-gray-100 my-2"></div>

              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="w-5 h-5 border-2 border-[#FB6F90] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/product?collection=${collection.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-[#FB6F90]/5 rounded-md transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FB6F90]/10 flex items-center justify-center overflow-hidden">
                      {collection.image ? (
                        <Image
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[#FB6F90] text-xs font-medium">{collection.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-gray-700 group-hover:text-[#FB6F90] transition-colors">
                      {collection.name}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

