"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, ChevronDown } from "lucide-react"
import { getAllCollections } from "@/app/firebase/firebase_services/firestore"
import Image from "next/image"

interface Collection {
  id: string
  name: string
  image?: string
}

interface MobileCollectionMenuProps {
  closeMenu: () => void
}

export default function MobileCollectionMenu({ closeMenu }: MobileCollectionMenuProps) {
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
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 w-full text-gray-700 hover:bg-[#FB6F90]/10 hover:text-[#FB6F90] rounded-lg transition-all duration-300 ease-in-out"
      >
        <div className="flex items-center space-x-4">
          <div className="text-[#FB6F90]/70">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-lg font-medium">Collections</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-8 overflow-hidden"
          >
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="w-5 h-5 border-2 border-[#FB6F90] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <Link
                  href="/product"
                  className="flex items-center gap-3 py-3 pl-4 pr-2 text-[#FB6F90] font-medium hover:bg-[#FB6F90]/10 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  All Collections
                </Link>

                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/product?collection=${collection.id}`}
                    className="flex items-center gap-3 py-3 pl-4 pr-2 text-gray-600 hover:bg-[#FB6F90]/10 hover:text-[#FB6F90] rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FB6F90]/10 flex items-center justify-center overflow-hidden">
                      {collection.image ? (
                        <Image
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.name}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[#FB6F90] text-xs">{collection.name.charAt(0)}</span>
                      )}
                    </div>
                    {collection.name}
                  </Link>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

