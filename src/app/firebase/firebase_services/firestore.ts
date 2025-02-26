"use client";

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
  Timestamp,
  increment,

} from "firebase/firestore";
import { firestore } from "./firebaseConfig";

// 2. Interfaces / Types

/** Represents a jewelry "Collection" (e.g., "Rings", "Necklaces", etc.) */
export interface CollectionData {
  name: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
  // Add more fields if needed (like createdAt)
}

/** Represents an individual product */
export interface ProductData {
  name: string;
  description?: string;
  price: number;
  images: string[];
  // which collection this product belongs to
  collectionId: string;
  isBestSeller?: boolean;
  stock:number;
}

/** Represents a user's order */
export interface OrderData {
  name: string;      // e.g. "John Doe"
  email: string;     // e.g. "john@example.com"
  phone: string;     // e.g. "123456789"
  address: string;   // e.g. "123 Street, City, Country"
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status?: string;   // e.g. "Pending", "Shipped", "Delivered"
  createdAt?: Date;   // Firestore timestamp
}
//reviews
export interface ReviewData {
  userId: string;      // ID of the user leaving the review
  username: string;    // Display name of the user
  rating: number;      // 1-5 star rating
  comment: string;     // User's written review
  createdAt?: Timestamp;     // Timestamp of review
}




// ===========================================================
// 3. READ / FETCH (USER-FACING)
// ===========================================================

/** Get ALL collections (for user to browse) */
export const getAllCollections = async () => {
  const collRef = collection(firestore, "collections");
  const snapshot = await getDocs(collRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/** Get specific collection by ID */
export const getCollectionById = async (collectionId: string) => {
  const docRef = doc(firestore, "collections", collectionId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

/** Get ALL products (regardless of collection) */
export const getAllProducts = async () => {
  const prodRef = collection(firestore, "products");
  const snapshot = await getDocs(prodRef);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description ?? "",
      price: data.price ?? 0,
      images: Array.isArray(data.images) ? data.images : [],
      collectionId: data.collectionId ?? "",
      isBestSeller: data.isBestSeller ?? false,
      stock: data.stock ?? 0,  // <-- retrieve or fallback
    };
  });
};


/** Get a single product by ID */
export const getProductById = async (productId: string) => {
  const prodRef = doc(firestore, "products", productId);
  const snapshot = await getDoc(prodRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

/** Get all products belonging to a specific collection */
export const getProductsByCollection = async (collectionId: string) => {
  const prodRef = collection(firestore, "products");
  const q = query(prodRef, where("collectionId", "==", collectionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ===========================================================
// 4. CREATE / UPDATE / DELETE (ADMIN-ONLY)
// ===========================================================

/** Create a new collection (admin) */
export const createCollection = async (data: CollectionData) => {
  const collRef = collection(firestore, "collections");
  const docRef = await addDoc(collRef, data);
  return docRef.id; // returns the new doc ID
};

/** Update an existing collection (admin) */
export const updateCollection = async (collectionId: string, data: Partial<CollectionData>) => {
  const collDocRef = doc(firestore, "collections", collectionId);
  await updateDoc(collDocRef, data);
};

/** Delete a collection by ID (admin) */
export const deleteCollectionById = async (collectionId: string) => {
  const collDocRef = doc(firestore, "collections", collectionId);
  await deleteDoc(collDocRef);
};

/** Create a new product (admin) */
export const createProduct = async (data: ProductData) => {
  const prodRef = collection(firestore, "products");
  // fallback if not provided
  const docRef = await addDoc(prodRef, {
    ...data,
    stock: data.stock ?? 0, // ensure 'stock' is saved
  });
  return docRef.id;
};
/** Update an existing product (admin) */
export const updateProduct = async (productId: string, data: Partial<ProductData>) => {
  const prodDocRef = doc(firestore, "products", productId);
  // fallback if not provided
  await updateDoc(prodDocRef, {
    ...data,
    stock: data.stock ?? 0,
  });
};

/** Delete a product by ID (admin) */
export const deleteProduct = async (productId: string) => {
  const prodDocRef = doc(firestore, "products", productId);
  await deleteDoc(prodDocRef);
};

/** Mark or unmark a collection as 'featured' (admin) */
export const toggleFeaturedCollection = async (collectionId: string, isFeatured: boolean) => {
  const collDocRef = doc(firestore, "collections", collectionId);
  await updateDoc(collDocRef, { isFeatured });
};

/** Mark or unmark a product as 'best seller' (admin) */
export const toggleBestSeller = async (productId: string, isBestSeller: boolean) => {
  const prodDocRef = doc(firestore, "products", productId);
  await updateDoc(prodDocRef, { isBestSeller });
};

// ===========================================================
// 5. ORDERS (USER & ADMIN)
// ===========================================================

/** Place a new order (user) */
export const placeOrder = async (orderData: OrderData) => {
  const ordersRef = collection(firestore, "orders");

  // we can auto-generate createdAt using serverTimestamp()
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    status: orderData.status || "Pending",
    createdAt: serverTimestamp(),
  });
    for (const item of orderData.items) {
    const productDocRef = doc(firestore, "products", item.productId);
    await updateDoc(productDocRef, {
      // Subtract the ordered quantity from stock
      stock: increment(-item.quantity),
    });
  }

  return docRef.id; // the newly created order's ID
};

/** Get a single order by ID (for user or admin) */
export const getOrderById = async (orderId: string) => {
  const orderDocRef = doc(firestore, "orders", orderId);
  const snapshot = await getDoc(orderDocRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

/** Optional: Get all orders (admin) */
export const getAllOrders = async () => {
  const ordersRef = collection(firestore, "orders");
  const snapshot = await getDocs(ordersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  const orderDocRef = doc(firestore, "orders", orderId);
  await updateDoc(orderDocRef, { status: newStatus });
};
export const getFeaturedCollections = async () => {
  const collRef = collection(firestore, "collections");
  const q = query(collRef, where("isFeatured", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBestSellers = async () => {
  const prodRef = collection(firestore, "products");
  const q = query(prodRef, where("isBestSeller", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// add reviews
export const addReviewToProduct = async (productId: string, review: ReviewData) => {
  const reviewsRef = collection(firestore, `products/${productId}/reviews`);
  await addDoc(reviewsRef, {
    ...review,
    createdAt: serverTimestamp(),
  });
};


export const getReviewsForProduct = async (productId: string) => {
  const reviewsRef = collection(firestore, `products/${productId}/reviews`);
  const snapshot = await getDocs(query(reviewsRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
