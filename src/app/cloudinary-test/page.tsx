"use client"

import { useState, useEffect } from "react"
import { getAllProducts } from "@/app/firebase/firebase_services/firestore"
import ImageDebugger from "../components/ImageDebugger"

type Product = {
  id: string
  name: string
  images: string[]
}

export default function CloudinaryTestPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cloudName, setCloudName] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const productsData = await getAllProducts()
        setProducts(productsData)

        // Get the Cloudinary cloud name from env
        const cloudNameEnv = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        setCloudName(cloudNameEnv || "Not configured")
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB6F90]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Cloudinary Image Test</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Environment Configuration</h2>
        <p>
          <strong>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:</strong> {cloudName}
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Note: If this is not configured correctly, images will not display properly.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Product Images</h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{product.name}</h3>

                {product.images && product.images.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">First image URL:</p>
                    <div className="bg-gray-50 p-2 rounded mb-4 overflow-x-auto">
                      <code className="text-xs">{product.images[0]}</code>
                    </div>

                    <ImageDebugger
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <p>No images available for this product.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

