// firebase/firebaseFirestore.ts
import { firestore } from "./firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// ---------- INTERFACES ----------
export interface CollectionData {
  name: string;
  description?: string;
  image?: string;
  // add more fields if needed (e.g. createdAt)
}

export interface ProductData {
  name: string;
  description?: string;
  price: number;
  image?: string;
  collectionId: string; // link to a doc in "collections"
  // add more fields if needed (stock, rating, etc.)
}

// ---------- COLLECTIONS CRUD ----------

// 1. GET ALL COLLECTIONS
export const getAllCollections = async () => {
  const collRef = collection(firestore, "collections");
  const snapshot = await getDocs(collRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 2. CREATE COLLECTION (ADMIN)
export const createCollection = async (data: CollectionData) => {
  const collRef = collection(firestore, "collections");
  const docRef = await addDoc(collRef, data);
  return docRef.id;
};

// 3. GET A SINGLE COLLECTION BY ID
export const getCollectionById = async (collectionId: string) => {
  const docRef = doc(firestore, "collections", collectionId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// 4. UPDATE COLLECTION (ADMIN)
export const updateCollection = async (
  collectionId: string,
  data: Partial<CollectionData>
) => {
  const docRef = doc(firestore, "collections", collectionId);
  return await updateDoc(docRef, data);
};

// 5. DELETE COLLECTION (ADMIN)
export const deleteCollectionById = async (collectionId: string) => {
  const docRef = doc(firestore, "collections", collectionId);
  return await deleteDoc(docRef);
};

// ---------- PRODUCTS CRUD ----------

// 6. GET ALL PRODUCTS
export const getAllProducts = async () => {
  const prodRef = collection(firestore, "products");
  const snapshot = await getDocs(prodRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 7. GET PRODUCT BY ID
export const getProductById = async (productId: string) => {
  const prodRef = doc(firestore, "products", productId);
  const snapshot = await getDoc(prodRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// 8. GET PRODUCTS FOR A SPECIFIC COLLECTION
export const getProductsByCollection = async (collectionId: string) => {
  const prodRef = collection(firestore, "products");
  const qProd = query(prodRef, where("collectionId", "==", collectionId));
  const snapshot = await getDocs(qProd);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 9. CREATE PRODUCT (ADMIN)
export const createProduct = async (data: ProductData) => {
  const prodRef = collection(firestore, "products");
  const docRef = await addDoc(prodRef, data);
  return docRef.id;
};

// 10. UPDATE PRODUCT (ADMIN)
export const updateProduct = async (
  productId: string,
  data: Partial<ProductData>
) => {
  const docRef = doc(firestore, "products", productId);
  return await updateDoc(docRef, data);
};

// 11. DELETE PRODUCT (ADMIN)
export const deleteProduct = async (productId: string) => {
  const docRef = doc(firestore, "products", productId);
  return await deleteDoc(docRef);
};

// e.g. For featured collections
export const getFeaturedCollections = async () => {
  const collRef = collection(firestore, "collections");
  const qFilter = query(collRef, where("isFeatured", "==", true));
  const snapshot = await getDocs(qFilter);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// e.g. For best sellers
export const getBestSellers = async () => {
  const prodRef = collection(firestore, "products");
  const qFilter = query(prodRef, where("isBestSeller", "==", true));
  const snapshot = await getDocs(qFilter);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};



/** ✅ Toggle "Featured Collection" */
export const toggleFeaturedCollection = async (collectionId: string, isFeatured: boolean) => {
  const collectionRef = doc(firestore, "collections", collectionId);
  return await updateDoc(collectionRef, { isFeatured });
};

/** ✅ Toggle "Best Seller" Product */
export const toggleBestSeller = async (productId: string, isBestSeller: boolean) => {
  const productRef = doc(firestore, "products", productId);
  return await updateDoc(productRef, { isBestSeller });
};