"use client"

// 1. Imports
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  type Timestamp,
  increment,
} from "firebase/firestore"
import { firestore } from "./firebaseConfig"
import { deleteFromCloudinary, getPublicIdFromUrl, uploadToCloudinary } from "@/app/cloudinary_service"
// Import the Cloudinary service

export interface CollectionData {
  name: string
  description?: string
  image?: string
  isFeatured?: boolean
  // Add more fields if needed (like createdAt)
}

export interface ProductData {
  name: string
  description?: string
  price: number
  images: string[]
  // which collection this product belongs to
  collectionId: string
  isBestSeller?: boolean
  stock: number
  video?: string
}

export interface OrderData {
  name: string // e.g. "John Doe"
  email: string // e.g. "john@example.com"
  phone: string // e.g. "123456789"
  address: string // e.g. "123 Street, City, Country"
  items: {
    productId: string
    name: string
    price: number
    quantity: number
  }[]
  totalAmount: number
  status?: string // e.g. "Pending", "Shipped", "Delivered"
  createdAt?: Date // Firestore timestamp
}

export interface ReviewData {
  userId: string // ID of the user leaving the review
  username: string // Display name of the user
  rating: number // 1-5 star rating
  comment: string // User's written review
  createdAt?: Timestamp // Timestamp of review
}

export const getAllCollections = async () => {
  const collRef = collection(firestore, "collections")
  const snapshot = await getDocs(collRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getCollectionById = async (collectionId: string) => {
  const docRef = doc(firestore, "collections", collectionId)
  const snapshot = await getDoc(docRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

// Improve logging in getAllProducts
export const getAllProducts = async () => {
  try {
    const prodRef = collection(firestore, "products")
    const snapshot = await getDocs(prodRef)

    const products = snapshot.docs.map((doc) => {
      const data = doc.data()
      console.log(`Product ${doc.id} data:`, data)
      return {
        id: doc.id,
        name: data.name,
        description: data.description ?? "",
        price: data.price ?? 0,
        images: Array.isArray(data.images) ? data.images : [],
        collectionId: data.collectionId ?? "",
        isBestSeller: data.isBestSeller ?? false,
        stock: data.stock ?? 0,
      }
    })

    console.log("All products data:", products)
    return products
  } catch (error) {
    console.error("Error in getAllProducts:", error)
    throw error
  }
}

// Improve logging in the getProductById function
export const getProductById = async (productId: string) => {
  try {
    const prodRef = doc(firestore, "products", productId)
    const snapshot = await getDoc(prodRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      console.log(`Product ${productId} data:`, data)
      console.log(`Product ${productId} images:`, data.images)
      return { id: snapshot.id, ...data }
    }
    return null
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error)
    return null
  }
}

export const getProductsByCollection = async (collectionId: string) => {
  const prodRef = collection(firestore, "products")
  const q = query(prodRef, where("collectionId", "==", collectionId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const createCollection = async (data: CollectionData) => {
  const collRef = collection(firestore, "collections")
  const docRef = await addDoc(collRef, data)
  return docRef.id // returns the new doc ID
}

export const updateCollection = async (collectionId: string, data: Partial<CollectionData>) => {
  const collDocRef = doc(firestore, "collections", collectionId)
  await updateDoc(collDocRef, data)
}

export const deleteCollectionById = async (collectionId: string) => {
  const collDocRef = doc(firestore, "collections", collectionId)
  await deleteDoc(collDocRef)
}

export const createProduct = async (data: ProductData) => {
  const prodRef = collection(firestore, "products")
  // fallback if not provided
  const docRef = await addDoc(prodRef, {
    ...data,
    stock: data.stock ?? 0, // ensure 'stock' is saved
  })
  return docRef.id
}

export const updateProduct = async (productId: string, data: Partial<ProductData>) => {
  const prodDocRef = doc(firestore, "products", productId)
  // fallback if not provided
  await updateDoc(prodDocRef, {
    ...data,
    stock: data.stock ?? 0,
  })
}

/** Delete a product by ID (admin) */
export const deleteProduct = async (productId: string) => {
  const prodDocRef = doc(firestore, "products", productId)
  await deleteDoc(prodDocRef)
}

export const toggleFeaturedCollection = async (collectionId: string, isFeatured: boolean) => {
  const collDocRef = doc(firestore, "collections", collectionId)
  await updateDoc(collDocRef, { isFeatured })
}

export const toggleBestSeller = async (productId: string, isBestSeller: boolean) => {
  const prodDocRef = doc(firestore, "products", productId)
  await updateDoc(prodDocRef, { isBestSeller })
}

export const placeOrder = async (orderData: OrderData) => {
  const ordersRef = collection(firestore, "orders")

  // we can auto-generate createdAt using serverTimestamp()
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    status: orderData.status || "Pending",
    createdAt: serverTimestamp(),
  })
  for (const item of orderData.items) {
    const productDocRef = doc(firestore, "products", item.productId)
    await updateDoc(productDocRef, {
      // Subtract the ordered quantity from stock
      stock: increment(-item.quantity),
    })
  }

  return docRef.id // the newly created order's ID
}

export const getOrderById = async (orderId: string) => {
  const orderDocRef = doc(firestore, "orders", orderId)
  const snapshot = await getDoc(orderDocRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export const getAllOrders = async () => {
  const ordersRef = collection(firestore, "orders")
  const snapshot = await getDocs(ordersRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  const orderDocRef = doc(firestore, "orders", orderId)
  await updateDoc(orderDocRef, { status: newStatus })
}
export const getFeaturedCollections = async () => {
  const collRef = collection(firestore, "collections")
  const q = query(collRef, where("isFeatured", "==", true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getBestSellers = async () => {
  const prodRef = collection(firestore, "products")
  const q = query(prodRef, where("isBestSeller", "==", true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const addReviewToProduct = async (productId: string, review: ReviewData) => {
  const reviewsRef = collection(firestore, `products/${productId}/reviews`)
  await addDoc(reviewsRef, {
    ...review,
    createdAt: serverTimestamp(),
  })
}

export const getReviewsForProduct = async (productId: string) => {
  const reviewsRef = collection(firestore, `products/${productId}/reviews`)
  const snapshot = await getDocs(query(reviewsRef, orderBy("createdAt", "desc")))
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Update the uploadImage function to use Cloudinary
export const uploadImage = async (file: File, folder = "products") => {
  if (!file) return null

  try {
    const result = await uploadToCloudinary(file, folder)
    return result.url
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    return null
  }
}

// Update the deleteImage function to use Cloudinary
export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) return

  try {
    const publicId = getPublicIdFromUrl(imageUrl)
    if (publicId) {
      await deleteFromCloudinary(publicId)
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
  }
}

// Update the uploadVideo function to use Cloudinary
export const uploadVideo = async (file: File, folder = "productVideos") => {
  if (!file) return null

  try {
    const result = await uploadToCloudinary(file, folder)
    return result.url
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error)
    return null
  }
}

