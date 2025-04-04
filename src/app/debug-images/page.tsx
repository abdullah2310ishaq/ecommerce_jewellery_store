"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getAllProducts } from "@/app/firebase/firebase_services/firestore"

interface Product {
  id: string
  name: string
  images?: string[]
}

export default function DebugImagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cloudName, setCloudName] = useState<string | null>(null)
  const [imageStatuses, setImageStatuses] = useState<Record<string, "loaded" | "error" | "loading">>({})

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const productsData: Product[] = await getAllProducts()
        setProducts(productsData)
        setCloudName(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "Not configured")
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleImageLoad = (productId: string) => {
    setImageStatuses((prev) => ({ ...prev, [productId]: "loaded" }))
  }

  const handleImageError = (productId: string) => {
    setImageStatuses((prev) => ({ ...prev, [productId]: "error" }))
  }

  return loading ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB6F90]"></div>
    </div>
  ) : error ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Image Debugging Tool</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Environment Configuration</h2>
        <p><strong>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:</strong> {cloudName}</p>
        <p><strong>CLOUDINARY_API_KEY:</strong> {process.env.CLOUDINARY_API_KEY ? "Configured" : "Not configured"}</p>
        <p><strong>CLOUDINARY_API_SECRET:</strong> {process.env.CLOUDINARY_API_SECRET ? "Configured" : "Not configured"}</p>
        <p className="mt-4 text-sm text-gray-600">Note: Ensure these are configured for image loading.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Product Images</h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const imageUrl = product.images?.[0]

              return (
                <div key={product.id} className="border rounded-lg p-4">
                  <h3 className="font-bold mb-2">{product.name}</h3>

                  {imageUrl ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Image URL:</p>
                      <div className="bg-gray-50 p-2 rounded mb-4 overflow-x-auto">
                        <code className="text-xs break-all">{imageUrl}</code>
                      </div>

                      <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          onLoad={() => handleImageLoad(product.id)}
                          onError={() => handleImageError(product.id)}
                        />
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Image Status:</p>
                        <div className="flex items-center mt-1">
                          {imageStatuses[product.id] === "loaded" ? (
                            <>
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                              <span className="text-sm">Loaded successfully</span>
                            </>
                          ) : imageStatuses[product.id] === "error" ? (
                            <>
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <span className="text-sm">Failed to load</span>
                            </>
                          ) : (
                            <>
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                              <span className="text-sm">Loading...</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* URL Analysis */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
                        <p className="text-sm font-medium text-gray-700 mb-2">URL Analysis:</p>
                        {(() => {
                          try {
                            const url = new URL(imageUrl)
                            const isCloudinary = url.hostname.includes("cloudinary.com")
                            const isFirebase = url.hostname.includes("firebasestorage.googleapis.com")

                            return (
                              <div className="space-y-1">
                                <p><strong>Protocol:</strong> {url.protocol}</p>
                                <p><strong>Hostname:</strong> {url.hostname}</p>
                                <p><strong>Path:</strong> {url.pathname}</p>
                                <p><strong>Type:</strong> {isCloudinary ? "Cloudinary" : isFirebase ? "Firebase" : "Other"}</p>
                                {isCloudinary && cloudName && !url.pathname.includes(cloudName) && (
                                  <p className="text-red-500 font-bold">
                                    Warning: URL does not include expected cloud name 
                                  </p>
                                )}
                              </div>
                            )
                          } catch {
                            return <p className="text-red-500">Invalid URL format</p>
                          }
                        })()}
                      </div>
                    </>
                  ) : (
                    <p>No images available for this product.</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
