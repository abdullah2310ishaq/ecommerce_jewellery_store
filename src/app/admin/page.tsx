/* eslint-disable @next/next/no-img-element */
"use client"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useEffect } from "react"

// Import your Firestore services (adjust the path as needed)
import {
  // PRODUCT functions
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleBestSeller,

  // COLLECTION functions
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollectionById,
  toggleFeaturedCollection,

  // IMAGE/VIDEO UPLOAD
  uploadImage,
  uploadVideo
} from "../firebase/firebase_services/firestore"

// ---------- PRODUCT INTERFACES ----------
interface FirestoreProduct {
  id: string
  name: string
  description?: string
  price: number
  images: string[]
  collectionId?: string
  isBestSeller?: boolean
  stock: number
  video?: string
}

interface ProductFormData {
  name: string
  description: string
  price: number
  images: string[]
  collectionId: string
  stock: number
  video?: string
}

// ---------- COLLECTION INTERFACES ----------
interface FirestoreCollection {
  id: string
  name: string
  description?: string
  image?: string
  isFeatured?: boolean
}

interface CollectionFormData {
  name: string
  description: string
  image: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ============ STATE: PRODUCTS ============
  const [products, setProducts] = useState<FirestoreProduct[]>([])
  const [newProduct, setNewProduct] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    images: [],
    collectionId: "",
    stock: 0,
    video: "",
  })
  
  // NEW STATE for holding selected image files (multiple)
  const [newProductImageFiles, setNewProductImageFiles] = useState<File[]>([])
  
  // NEW STATE for holding selected video file (single)
  const [newProductVideoFile, setNewProductVideoFile] = useState<File | null>(null)

  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editingProductData, setEditingProductData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    images: [],
    collectionId: "",
    stock: 0,
    video: "",
  })
  
  // For editing flow, we also let the user pick new image files or a new video
  const [editingImageFiles, setEditingImageFiles] = useState<File[]>([])
  const [editingVideoFile, setEditingVideoFile] = useState<File | null>(null)

  // ============ STATE: COLLECTIONS ============
  const [collections, setCollections] = useState<FirestoreCollection[]>([])
  const [newCollection, setNewCollection] = useState<CollectionFormData>({
    name: "",
    description: "",
    image: "",
  })
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [editingCollectionData, setEditingCollectionData] = useState<CollectionFormData>({
    name: "",
    description: "",
    image: "",
  })

  // ============ AUTH CHECK ON MOUNT ============
  useEffect(() => {
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-auth="))
      ?.split("=")[1]

    if (authCookie === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      router.push("/admin/loggin")
    }
  }, [router])

  // ============ FETCH DATA WHEN AUTHENTICATED ============
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchData = async () => {
      try {
        const prodData = await getAllProducts()
        setProducts(prodData as FirestoreProduct[])
        const collData = await getAllCollections()
        setCollections(collData as FirestoreCollection[])
      } catch (error) {
        console.error("Error fetching products/collections:", error)
      }
    }

    fetchData()
  }, [isAuthenticated])

  // If not authenticated, show nothing
  if (!isAuthenticated) return null

  // =========================================
  // ============ PRODUCT HANDLERS ===========
  // =========================================

  // Update local state for simple text fields
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  // When user selects images (multiple), store them in state
  const handleNewProductImagesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setNewProductImageFiles(Array.from(e.target.files))
  }

  // When user selects a video (single)
  const handleNewProductVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setNewProductVideoFile(e.target.files[0]) // single file
  }

  // CREATE product: Upload each image, plus the video, then create
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 1) Upload images if any
      const imageURLs: string[] = []
      for (const file of newProductImageFiles) {
        const url = await uploadImage(file)
        if (url) {
          imageURLs.push(url)
        }
      }

      // 2) Upload video if any
      let videoURL = ""
      if (newProductVideoFile) {
        const vidUrl = await uploadVideo(newProductVideoFile)
        if (vidUrl) videoURL = vidUrl
      }

      // 3) Create product in Firestore
      const createdId = await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        images: imageURLs,
        video: videoURL,
      })
      alert(`Product created with ID: ${createdId}`)

      // Re-fetch products
      const prodData = await getAllProducts()
      setProducts(prodData as FirestoreProduct[])

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        images: [],
        collectionId: "",
        stock: 0,
        video: "",
      })
      setNewProductImageFiles([])
      setNewProductVideoFile(null)
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  // Start editing a product
  const startEditingProduct = (product: FirestoreProduct) => {
    setEditingProductId(product.id)
    setEditingProductData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      images: product.images || [],
      collectionId: product.collectionId || "",
      stock: product.stock,
      video: product.video || "",
    })

    // Clear out any newly selected files from prior editing
    setEditingImageFiles([])
    setEditingVideoFile(null)
  }

  // For text fields in EDIT form
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditingProductData((prev) => ({ ...prev, [name]: value }))
  }

  // For new image files in EDIT form
  const handleEditingProductImagesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setEditingImageFiles(Array.from(e.target.files))
  }

  // For new video file in EDIT form
  const handleEditingProductVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setEditingVideoFile(e.target.files[0])
  }

  // UPDATE product
  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProductId) return

    try {
      // 1) If user selected new image files, upload them & add to existing images
      const updatedImages = [...editingProductData.images]
      for (const file of editingImageFiles) {
        const url = await uploadImage(file)
        if (url) {
          updatedImages.push(url)
        }
      }

      // 2) If user selected a new video, upload it
      let updatedVideo = editingProductData.video || ""
      if (editingVideoFile) {
        const vidUrl = await uploadVideo(editingVideoFile)
        if (vidUrl) updatedVideo = vidUrl
      }

      // 3) Save updated fields to Firestore
      await updateProduct(editingProductId, {
        ...editingProductData,
        price: Number(editingProductData.price),
        stock: Number(editingProductData.stock),
        images: updatedImages,
        video: updatedVideo,
      })

      alert(`Product updated: ${editingProductId}`)

      // Refresh
      const prodData = await getAllProducts()
      setProducts(prodData as FirestoreProduct[])

      // Clear editing
      setEditingProductId(null)
      setEditingImageFiles([])
      setEditingVideoFile(null)
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await deleteProduct(productId)
      alert(`Product deleted: ${productId}`)
      const prodData = await getAllProducts()
      setProducts(prodData as FirestoreProduct[])
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleToggleBestSeller = async (productId: string, isBestSeller: boolean) => {
    try {
      await toggleBestSeller(productId, !isBestSeller)
      alert(`Product ${productId} updated: isBestSeller -> ${!isBestSeller}`)
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, isBestSeller: !isBestSeller } : p)))
    } catch (error) {
      console.error("Error toggling best seller:", error)
    }
  }

  // =========================================
  // ========== COLLECTION HANDLERS ==========
  // =========================================

  const handleNewCollectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCollection((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const createdId = await createCollection(newCollection)
      alert(`Collection created with ID: ${createdId}`)
      const collData = await getAllCollections()
      setCollections(collData as FirestoreCollection[])
      setNewCollection({ name: "", description: "", image: "" })
    } catch (error) {
      console.error("Error creating collection:", error)
    }
  }

  const startEditingCollection = (collection: FirestoreCollection) => {
    setEditingCollectionId(collection.id)
    setEditingCollectionData({
      name: collection.name,
      description: collection.description || "",
      image: collection.image || "",
    })
  }

  const handleEditCollectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditingCollectionData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCollectionId) return
    try {
      await updateCollection(editingCollectionId, editingCollectionData)
      alert(`Collection updated: ${editingCollectionId}`)
      const collData = await getAllCollections()
      setCollections(collData as FirestoreCollection[])
      setEditingCollectionId(null)
    } catch (error) {
      console.error("Error updating collection:", error)
    }
  }

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return
    try {
      await deleteCollectionById(collectionId)
      alert(`Collection deleted: ${collectionId}`)
      const collData = await getAllCollections()
      setCollections(collData as FirestoreCollection[])
    } catch (error) {
      console.error("Error deleting collection:", error)
    }
  }

  const handleToggleFeaturedCollection = async (collectionId: string, isFeatured: boolean) => {
    try {
      await toggleFeaturedCollection(collectionId, !isFeatured)
      alert(`Collection ${collectionId} updated isFeatured -> ${!isFeatured}`)
      setCollections((prev) => prev.map((c) => (c.id === collectionId ? { ...c, isFeatured: !isFeatured } : c)))
    } catch (error) {
      console.error("Error toggling featured collection:", error)
    }
  }

  // =========================================
  // =============== LOGOUT ==================
  // =========================================
  function logout() {
    document.cookie = "admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/admin/loggin"
  }

  // =========================================
  // =============== RENDER UI ===============
  // =========================================

  return (
    <div className="min-h-screen pt-20 px-4 pb-4 bg-gray-100 text-gray-900">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/analytics")} className="bg-green-500 text-white px-3 py-1 rounded">
            Profit
          </button>
          <button onClick={() => router.push("/admin/orders")} className="bg-purple-500 text-white px-3 py-1 rounded">
            Orders
          </button>
          <button
            onClick={() => {
              logout()
              router.push("/admin/loggin")
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================== PRODUCTS ================== */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* CREATE NEW PRODUCT FORM */}
        <div className="w-full md:w-1/2 p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Add New Product</h2>
          {collections.length === 0 ? (
            <p className="text-sm text-red-500">No collections found. Create a collection first.</p>
          ) : (
            <form onSubmit={handleCreateProduct} className="flex flex-col gap-2">
              <input
                type="text"
                name="name"
                placeholder="Product name"
                value={newProduct.name}
                onChange={handleNewProductChange}
                className="border p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={newProduct.description}
                onChange={handleNewProductChange}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={handleNewProductChange}
                className="border p-2 rounded"
                required
              />

              {/* Multiple image files */}
              <label className="text-sm font-medium">Select Images (you can choose multiple)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewProductImagesFileChange}
                className="border p-2"
              />

              {/* Optional video file */}
              <label className="text-sm font-medium">Optional Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleNewProductVideoFileChange}
                className="border p-2"
              />

              {/* Collection Select */}
              <select
                name="collectionId"
                value={newProduct.collectionId}
                onChange={handleNewProductChange}
                className="border p-2 rounded"
                required
              >
                <option value="">-- Select Collection --</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2">
                Add Product
              </button>
            </form>
          )}
        </div>

        {/* EXISTING PRODUCTS */}
        <div className="w-full md:w-1/2 p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Existing Products</h2>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="border p-2 rounded">
                  {editingProductId === product.id ? (
                    // EDIT FORM
                    <form onSubmit={handleUpdateProductSubmit} className="flex flex-col gap-2">
                      <input
                        type="text"
                        name="name"
                        value={editingProductData.name}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                        required
                      />
                      <textarea
                        name="description"
                        value={editingProductData.description}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                      />
                      <input
                        type="number"
                        name="price"
                        value={editingProductData.price}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                        required
                      />
                      <input
                        type="number"
                        name="stock"
                        value={editingProductData.stock}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                        required
                      />

                      {/* Show existing images, if any */}
                      {editingProductData.images?.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {editingProductData.images.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={`Product Image ${idx}`}
                              className="w-16 h-16 object-cover border rounded"
                            />
                          ))}
                        </div>
                      )}

                      {/* Optionally show existing video, if any */}
                      {editingProductData.video && (
                        <video
                          src={editingProductData.video}
                          controls
                          className="w-32 h-auto border rounded"
                        />
                      )}

                      {/* Allow user to add more images */}
                      <label className="text-sm font-medium">Add More Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEditingProductImagesFileChange}
                        className="border p-1"
                      />

                      {/* Allow user to replace or add a new video */}
                      <label className="text-sm font-medium">Replace/Add Video</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleEditingProductVideoFileChange}
                        className="border p-1"
                      />

                      <select
                        name="collectionId"
                        value={editingProductData.collectionId}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                      >
                        <option value="">-- Select Collection --</option>
                        {collections.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        <button type="submit" className="bg-green-600 text-white p-1 rounded">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="bg-gray-400 p-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // DISPLAY PRODUCT
                    <>
                      <div className="font-semibold">
                        {product.name} – Rs{product.price}
                      </div>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>

                      {/* Show multiple images */}
                      {product.images && product.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {product.images.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl || "/placeholder.svg"}
                              alt={product.name}
                              className="w-24 h-24 object-cover border rounded"
                            />
                          ))}
                        </div>
                      )}

                      {/* Show video if exists */}
                      {product.video && (
                        <video src={product.video} controls className="w-32 h-auto border rounded my-2" />
                      )}

                      {product.description && <p>{product.description}</p>}
                      <p className="text-sm text-gray-500">ID: {product.id}</p>
                      <p className="text-sm text-gray-500">Collection ID: {product.collectionId || "None"}</p>

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleToggleBestSeller(product.id, product.isBestSeller || false)}
                          className="bg-yellow-500 text-white p-1 rounded"
                        >
                          {product.isBestSeller ? "Remove Best Seller" : "Mark Best Seller"}
                        </button>
                        <button
                          onClick={() => startEditingProduct(product)}
                          className="bg-blue-500 text-white p-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 text-white p-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================== SEPARATOR ================== */}
      <hr className="my-6" />

      {/* ================== COLLECTIONS ================== */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* CREATE NEW COLLECTION FORM */}
        <div className="w-full md:w-1/2 p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Add New Collection</h2>
          <form onSubmit={handleCreateCollection} className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              placeholder="Collection name"
              value={newCollection.name}
              onChange={handleNewCollectionChange}
              className="border p-2 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={newCollection.description}
              onChange={handleNewCollectionChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL (optional)"
              value={newCollection.image}
              onChange={handleNewCollectionChange}
              className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2">
              Add Collection
            </button>
          </form>
        </div>

        {/* EXISTING COLLECTIONS */}
        <div className="w-full md:w-1/2 p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Existing Collections</h2>
          {collections.length === 0 ? (
            <p>No collections found.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {collections.map((collection) => (
                <div key={collection.id} className="border p-2 rounded">
                  {editingCollectionId === collection.id ? (
                    // EDIT COLLECTION FORM
                    <form onSubmit={handleUpdateCollectionSubmit} className="flex flex-col gap-2">
                      <input
                        type="text"
                        name="name"
                        value={editingCollectionData.name}
                        onChange={handleEditCollectionChange}
                        className="border p-1 rounded"
                        required
                      />
                      <textarea
                        name="description"
                        value={editingCollectionData.description}
                        onChange={handleEditCollectionChange}
                        className="border p-1 rounded"
                      />
                      <input
                        type="text"
                        name="image"
                        value={editingCollectionData.image}
                        onChange={handleEditCollectionChange}
                        className="border p-1 rounded"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-green-600 text-white p-1 rounded">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCollectionId(null)}
                          className="bg-gray-400 p-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // DISPLAY COLLECTION
                    <>
                      <div>
                        <strong>{collection.name}</strong>
                      </div>
                      {collection.image && (
                        <img
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.name}
                          className="w-24 h-24 object-cover my-1"
                        />
                      )}
                      {collection.description && <p>{collection.description}</p>}
                      <p className="text-sm text-gray-500">ID: {collection.id}</p>
                      {collection.isFeatured ? (
                        <p className="text-green-600 text-sm">Featured ✔</p>
                      ) : (
                        <p className="text-gray-500 text-sm">Not Featured</p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleToggleFeaturedCollection(collection.id, collection.isFeatured || false)}
                          className="bg-yellow-500 text-white p-1 rounded"
                        >
                          {collection.isFeatured ? "Remove Featured" : "Make Featured"}
                        </button>
                        <button
                          onClick={() => startEditingCollection(collection)}
                          className="bg-blue-500 text-white p-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCollection(collection.id)}
                          className="bg-red-500 text-white p-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
