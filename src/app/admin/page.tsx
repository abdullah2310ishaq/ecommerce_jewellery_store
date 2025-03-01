/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "../firebase/firebase_services/firestore";

// ---------- PRODUCT INTERFACES ----------
interface FirestoreProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  collectionId?: string;
  isBestSeller?: boolean;
  stock: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  images: string[];
  collectionId: string;
  stock: number;
}

// ---------- COLLECTION INTERFACES ----------
interface FirestoreCollection {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
}

interface CollectionFormData {
  name: string;
  description: string;
  image: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============ STATE: PRODUCTS ============
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [newProduct, setNewProduct] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    images: [],
    collectionId: "",
    stock: 0,
  });
  const [newProductImagesText, setNewProductImagesText] = useState<string>("");

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductData, setEditingProductData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    images: [],
    collectionId: "",
    stock: 0,
  });
  const [editingImagesText, setEditingImagesText] = useState<string>("");

  // ============ STATE: COLLECTIONS ============
  const [collections, setCollections] = useState<FirestoreCollection[]>([]);
  const [newCollection, setNewCollection] = useState<CollectionFormData>({
    name: "",
    description: "",
    image: "",
  });
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);

  // ============ FETCH DATA ON MOUNT ============
  // 1️⃣ Check auth cookie
  useEffect(() => {
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-auth="))
      ?.split("=")[1];

    if (authCookie === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      router.push("/admin/loggin");
    }
  }, [router]);

  // 2️⃣ Fetch data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const prodData = await getAllProducts();
        setProducts(prodData as FirestoreProduct[]);
        const collData = await getAllCollections();
        setCollections(collData as FirestoreCollection[]);
      } catch (error) {
        console.error("Error fetching products/collections:", error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // 3️⃣ Render nothing if not authenticated
  if (!isAuthenticated) return null;

  // =========================================
  // ============ PRODUCT HANDLERS ===========
  // =========================================

  const handleNewProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewProductImagesTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewProductImagesText(e.target.value);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imagesArray = newProductImagesText
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url);

      const createdId = await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        images: imagesArray,
      });
      alert(`Product created with ID: ${createdId}`);

      const prodData = await getAllProducts();
      setProducts(prodData as FirestoreProduct[]);

      setNewProduct({
        name: "",
        description: "",
        price: 0,
        images: [],
        collectionId: "",
        stock: 0,
      });
      setNewProductImagesText("");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const startEditingProduct = (product: FirestoreProduct) => {
    setEditingProductId(product.id);
    const imagesText = product.images.join("\n");
    setEditingProductData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      images: product.images,
      collectionId: product.collectionId || "",
      stock: product.stock,
    });
    setEditingImagesText(imagesText);
  };

  const handleEditProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditingProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProductImagesTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditingImagesText(e.target.value);
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;
    try {
      const imagesArray = editingImagesText
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url);

      await updateProduct(editingProductId, {
        ...editingProductData,
        price: Number(editingProductData.price),
        stock: Number(editingProductData.stock),
        images: imagesArray,
      });
      alert(`Product updated: ${editingProductId}`);

      const prodData = await getAllProducts();
      setProducts(prodData as FirestoreProduct[]);

      setEditingProductId(null);
      setEditingImagesText("");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      alert(`Product deleted: ${productId}`);
      const prodData = await getAllProducts();
      setProducts(prodData as FirestoreProduct[]);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleBestSeller = async (productId: string, isBestSeller: boolean) => {
    try {
      await toggleBestSeller(productId, !isBestSeller);
      alert(`Product ${productId} updated: isBestSeller -> ${!isBestSeller}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isBestSeller: !isBestSeller } : p
        )
      );
    } catch (error) {
      console.error("Error toggling best seller:", error);
    }
  };

  // =========================================
  // ========== COLLECTION HANDLERS ==========
  // =========================================

  const handleNewCollectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCollection((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdId = await createCollection(newCollection);
      alert(`Collection created with ID: ${createdId}`);
      const collData = await getAllCollections();
      setCollections(collData as FirestoreCollection[]);
      setNewCollection({ name: "", description: "", image: "" });
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const startEditingCollection = (collection: FirestoreCollection) => {
    setEditingCollectionId(collection.id);
    setEditingCollectionData({
      name: collection.name,
      description: collection.description || "",
      image: collection.image || "",
    });
  };

  const [editingCollectionData, setEditingCollectionData] = useState<CollectionFormData>({
    name: "",
    description: "",
    image: "",
  });

  const handleEditCollectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingCollectionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollectionId) return;
    try {
      await updateCollection(editingCollectionId, editingCollectionData);
      alert(`Collection updated: ${editingCollectionId}`);
      const collData = await getAllCollections();
      setCollections(collData as FirestoreCollection[]);
      setEditingCollectionId(null);
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    try {
      await deleteCollectionById(collectionId);
      alert(`Collection deleted: ${collectionId}`);
      const collData = await getAllCollections();
      setCollections(collData as FirestoreCollection[]);
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleToggleFeaturedCollection = async (collectionId: string, isFeatured: boolean) => {
    try {
      await toggleFeaturedCollection(collectionId, !isFeatured);
      alert(`Collection ${collectionId} updated: isFeatured -> ${!isFeatured}`);
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId ? { ...c, isFeatured: !isFeatured } : c
        )
      );
    } catch (error) {
      console.error("Error toggling featured collection:", error);
    }
  };

  function logout() {
    document.cookie =
      "admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/admin/loggin";
  }

  // =========================================
  // =============== RENDER UI ===============
  // =========================================

  return (
    <div className="min-h-screen p-4 bg-white text-gray-900">
      <header className="flex justify-between items-center mb-4"></header>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <button
        onClick={() => {
          logout();
          router.push("/admin/loggin");
        }}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
      <button type="submit" className="bg-[#FB6F90] text-white p-1 rounded">
        Save
      </button>
      {/* ================== PRODUCTS ================== */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* CREATE NEW PRODUCT FORM */}
        <div className="w-full md:w-1/2 p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Add New Product</h2>
          {collections.length === 0 ? (
            <p className="text-sm text-red-500">
              No collections found. Create a collection first.
            </p>
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
              <label className="text-sm font-medium">
                Image URLs (one per line)
              </label>
              <textarea
                placeholder="Enter each image URL on its own line"
                value={newProductImagesText}
                onChange={handleNewProductImagesTextChange}
                className="border p-2 rounded h-24"
              />
              <label htmlFor="collectionId" className="text-sm font-medium">
                Collection
              </label>
              <select
                id="collectionId"
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
              <button
                type="submit"
                className="bg-[#FB6F90] text-white p-2 rounded mt-2"
              >
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
                    <form
                      onSubmit={handleUpdateProductSubmit}
                      className="flex flex-col gap-2"
                    >
                      <label className="text-sm font-medium" htmlFor="edit-name">
                        Name
                      </label>
                      <input
                        id="edit-name"
                        type="text"
                        name="name"
                        value={editingProductData.name}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                        required
                      />
                      <label className="text-sm font-medium" htmlFor="edit-description">
                        Description
                      </label>
                      <textarea
                        id="edit-description"
                        name="description"
                        value={editingProductData.description}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                      />
                      <label className="text-sm font-medium" htmlFor="edit-price">
                        Price
                      </label>
                      <input
                        id="edit-price"
                        type="number"
                        name="price"
                        value={editingProductData.price}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                        required
                      />
                      <label className="text-sm font-medium" htmlFor="edit-stock">
                        Stock
                      </label>
                      <input
                        id="edit-stock"
                        type="number"
                        name="stock"
                        value={editingProductData.stock}
                        onChange={handleEditProductChange}
                        className="border p-1 rounded"
                        required
                      />
                      <label className="text-sm font-medium" htmlFor="edit-images">
                        Image URLs (one per line)
                      </label>
                      <textarea
                        id="edit-images"
                        value={editingImagesText}
                        onChange={handleEditProductImagesTextChange}
                        className="border p-1 rounded h-24"
                      />
                      <label className="text-sm font-medium" htmlFor="edit-collection">
                        Collection
                      </label>
                      <select
                        id="edit-collection"
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
                        <button
                          type="submit"
                          className="bg-[#FB6F90] text-white p-1 rounded"
                        >
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
                    <>
                      <div className="font-semibold">
                        {product.name} – Rs{product.price}
                      </div>
                      <p className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </p>
                      {product.images && product.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {product.images.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={product.name}
                              className="w-24 h-24 object-cover border rounded"
                            />
                          ))}
                        </div>
                      )}
                      {product.description && <p>{product.description}</p>}
                      <p className="text-sm text-gray-500">ID: {product.id}</p>
                      <p className="text-sm text-gray-500">
                        Collection ID: {product.collectionId || "None"}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() =>
                            handleToggleBestSeller(
                              product.id,
                              product.isBestSeller || false
                            )
                          }
                          className="bg-[#FB6F90] text-white p-1 rounded"
                        >
                          {product.isBestSeller
                            ? "Remove Best Seller"
                            : "Mark Best Seller"}
                        </button>
                        <button
                          onClick={() => startEditingProduct(product)}
                          className="bg-[#FB6F90] text-white p-1 rounded"
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
            <button
              type="submit"
              className="bg-[#FB6F90] text-white p-2 rounded mt-2"
            >
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
                    <form
                      onSubmit={handleUpdateCollectionSubmit}
                      className="flex flex-col gap-2"
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Collection name"
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
                        <button
                          type="submit"
                          className="bg-[#FB6F90] text-white p-1 rounded"
                        >
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
                    <>
                      <div>
                        <strong>{collection.name}</strong>
                      </div>
                      {collection.image && (
                        <img
                          src={collection.image}
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
                          onClick={() =>
                            handleToggleFeaturedCollection(
                              collection.id,
                              collection.isFeatured || false
                            )
                          }
                          className="bg-[#FB6F90] text-white p-1 rounded"
                        >
                          {collection.isFeatured ? "Remove Featured" : "Make Featured"}
                        </button>
                        <button
                          onClick={() => startEditingCollection(collection)}
                          className="bg-[#FB6F90] text-white p-1 rounded"
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
  );
}
