"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  Shield,
  Package,
  ArrowLeft,
  Star,
  Eye
} from "lucide-react";
import { getProductById } from "@/app/firebase/firebase_services/firestore";

// If your Firestore has similar product logic, you can also import that
// import { getSimilarProducts } from "@/app/firebase/firebase_services/firebaseFirestore";

// Define an interface that matches your Firestore product data
interface ProductData {
  id: string;
  name: string;
  description?: string;
  price: number;     
  images?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  status?: string;   // e.g., "In Stock" or "Out of Stock"
  details?: string[]; // for the bullet points
  // any other fields you store in Firestore
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  // Local State
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showEngraving, setShowEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState("");
  const [show360Preview, setShow360Preview] = useState(false);

  // Example: "Similar products"
  const [similarProducts, setSimilarProducts] = useState<any[]>([
    {
      id: "sp1",
      name: "Golden Hoop Earrings",
      price: 799,
      img: "https://images.pexels.com/photos/11914482/pexels-photo-11914482.jpeg",
    },
    {
      id: "sp2",
      name: "Diamond Infinity Bracelet",
      price: 1299,
      img: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg",
    },
  ]);

  // ============== 1. Fetch the product by ID from Firestore ==============
  useEffect(() => {
    if (!id) return; // no ID in URL
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const doc = await getProductById(id); // your Firestore function
        if (!doc) {
          // No product found in Firestore
          console.error("Product not found");
          // Optionally redirect to 404 or shop page
          // router.push("/shop");
        } else {
          // doc is { id: docId, name, description, etc. }
          // Convert any fields as needed (like price to number)
          setProduct({
            id: doc.id,
            name: doc.name,
            description: doc.description ?? "",
            price: doc.price ?? 0,
            images: doc.images ?? [],
            rating: doc.rating ?? 5,
            reviews: doc.reviews ?? 0,
            stock: doc.stock ?? 5,
            status: doc.status ?? "In Stock",
            details: doc.details ?? [],
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ============== 2. Handle Add to Cart ==============
  const handleAddToCart = () => {
    if (!product) return;
    let message = `Added ${product.name} (x${quantity}) to cart.`;
    if (engravingText) {
      message += ` Engraving: "${engravingText}"`;
    }
    alert(message);
  };

  // ============== 3. Loading / Not Found States ==============
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-yellow-100">
        <p className="text-xl">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-gray-200">
        <p>Product not found!</p>
        <button
          onClick={() => router.push("/shop")}
          className="mt-4 px-4 py-2 bg-yellow-600 rounded"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  // ============== 4. Render the Detailed Page ==============
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100 relative">
      {/* 360 Preview Modal */}
      {show360Preview && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-xl p-6 max-w-3xl w-full relative">
            <button
              onClick={() => setShow360Preview(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-yellow-400 transition"
            >
              ✕
            </button>
            <h2 className="text-2xl font-medium mb-4 text-yellow-400">
              360° Preview
            </h2>
            <div className="aspect-video w-full bg-gray-800 flex items-center justify-center text-gray-500">
              {/* Placeholder for actual 360° model or video */}
              <p className="text-center">[360° Video / Model Viewer Placeholder]</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation (Back Button) */}
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-black to-gray-900 shadow-2xl">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-yellow-400 scale-95"
                        : "hover:ring-2 hover:ring-yellow-400/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-8">
            {/* Title and Rating */}
            <div>
              <h1 className="text-4xl font-serif mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                {/* Star Rating */}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const isFilled = i < Math.round(product.rating || 0);
                    return (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          isFilled
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-500"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-gray-400">
                  ({product.reviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price and Stock Status */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl text-yellow-400 font-light">
                  ${product.price}
                </span>
                <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  {product.stock ? `Only ${product.stock} left` : "In Stock"}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Status:{" "}
                <span className="text-yellow-400 font-medium">
                  {product.status || "In Stock"}
                </span>
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-300 leading-relaxed text-lg">
                {product.description}
              </p>
            )}

            {/* Product Features */}
            {product.details && product.details.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-yellow-400">Features</h3>
                <ul className="space-y-3 text-gray-300">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-6">
              <span className="text-lg">Quantity:</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-full border border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      product.stock ? Math.min(product.stock, q + 1) : q + 1
                    )
                  }
                  className="p-2 rounded-full border border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Engraving Option */}
            <div className="space-y-3">
              <button
                onClick={() => setShowEngraving(!showEngraving)}
                className="px-4 py-2 border border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
              >
                {showEngraving ? "Remove Engraving" : "Add Engraving"}
              </button>
              {showEngraving && (
                <input
                  type="text"
                  placeholder="Enter engraving text..."
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-8 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlist(!isWishlist)}
                className={`p-4 rounded-lg border transition-all ${
                  isWishlist
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                    : "border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${isWishlist ? "fill-yellow-400" : ""}`}
                />
              </button>
              <button
                className="p-4 rounded-lg border border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                onClick={() => setShow360Preview(true)}
              >
                <Eye className="w-6 h-6 text-gray-200" />
              </button>
              <button className="p-4 rounded-lg border border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-800">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <Shield className="w-8 h-8 text-yellow-400" />
                <div>
                  <h4 className="font-medium">Secure Payment</h4>
                  <p className="text-sm text-gray-400">100% secure transaction</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <Package className="w-8 h-8 text-yellow-400" />
                <div>
                  <h4 className="font-medium">Premium Packaging</h4>
                  <p className="text-sm text-gray-400">Luxury gift box included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Example */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {similarProducts.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors flex flex-col items-center"
              >
                <div className="relative w-full h-56 overflow-hidden rounded-lg mb-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h3 className="text-lg text-yellow-400 mb-2">{item.name}</h3>
                <p className="text-gray-300 text-sm">${item.price}</p>
                <button className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
