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
import { firestore,storage } from "./firebaseConfig";
import {ref,uploadBytes,getDownloadURL, deleteObject} from "firebase/storage";


export interface CollectionData {
  name: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
  // Add more fields if needed (like createdAt)
}

export interface ProductData {
  name: string;
  description?: string;
  price: number;
  images: string[];
  // which collection this product belongs to
  collectionId: string;
  isBestSeller?: boolean;
  stock:number;
  video?: string;
}

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

export interface ReviewData {
  userId: string;      // ID of the user leaving the review
  username: string;    // Display name of the user
  rating: number;      // 1-5 star rating
  comment: string;     // User's written review
  createdAt?: Timestamp;     // Timestamp of review
}

export const getAllCollections = async () => {
  const collRef = collection(firestore, "collections");
  const snapshot = await getDocs(collRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCollectionById = async (collectionId: string) => {
  const docRef = doc(firestore, "collections", collectionId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

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

export const getProductById = async (productId: string) => {
  const prodRef = doc(firestore, "products", productId);
  const snapshot = await getDoc(prodRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const getProductsByCollection = async (collectionId: string) => {
  const prodRef = collection(firestore, "products");
  const q = query(prodRef, where("collectionId", "==", collectionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createCollection = async (data: CollectionData) => {
  const collRef = collection(firestore, "collections");
  const docRef = await addDoc(collRef, data);
  return docRef.id; // returns the new doc ID
};

export const updateCollection = async (collectionId: string, data: Partial<CollectionData>) => {
  const collDocRef = doc(firestore, "collections", collectionId);
  await updateDoc(collDocRef, data);
};


export const deleteCollectionById = async (collectionId: string) => {
  const collDocRef = doc(firestore, "collections", collectionId);
  await deleteDoc(collDocRef);
};

export const createProduct = async (data: ProductData) => {
  const prodRef = collection(firestore, "products");
  // fallback if not provided
  const docRef = await addDoc(prodRef, {
    ...data,
    stock: data.stock ?? 0, // ensure 'stock' is saved
  });
  return docRef.id;
};

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

export const toggleFeaturedCollection = async (collectionId: string, isFeatured: boolean) => {
  const collDocRef = doc(firestore, "collections", collectionId);
  await updateDoc(collDocRef, { isFeatured });
};

export const toggleBestSeller = async (productId: string, isBestSeller: boolean) => {
  const prodDocRef = doc(firestore, "products", productId);
  await updateDoc(prodDocRef, { isBestSeller });
};


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

export const getOrderById = async (orderId: string) => {
  const orderDocRef = doc(firestore, "orders", orderId);
  const snapshot = await getDoc(orderDocRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

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

// upload image
export const uploadImage = async (file: File, folder: string = "products") => {
  if (!file) return null
  // Create a unique filename using a timestamp + the original name
  const uniqueFilename = `${Date.now()}-${file.name}`
  // e.g. "products/1688830123456-myPhoto.jpg"
  const storageRef = ref(storage, `${folder}/${uniqueFilename}`)
  await uploadBytes(storageRef, file)

  const downloadURL = await getDownloadURL(storageRef)
  return downloadURL
}
// delete image
export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) return
  const storageRef = ref(storage, imageUrl)
  await deleteObject(storageRef)
}

export const uploadVideo = async (file: File, folder: string = "productVideos") => {
  if (!file) return null
  const uniqueFilename = `${Date.now()}-${file.name}`
  const storageRef = ref(storage, `${folder}/${uniqueFilename}`)
  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)
  return downloadURL
}