"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { addToCart } from "@/app/cart/cart";
import { useAuth } from "@/app/context/AuthContext";
import { getProductById, getReviewsForProduct, addReviewToProduct } from "@/app/firebase/firebase_services/firestore";
import type { Timestamp } from "firebase/firestore";
import { Star, ShoppingCart, Heart, Share2, User } from "lucide-react";

interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string[];
  features?: string[];
  category?: string;
  stock?: number; // <-- NEW
}

interface ReviewData {
  id?: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt?: Timestamp;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  
  // ---------- STATE ----------
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [prodLoading, setProdLoading] = useState(true);

  // ---------- QUANTITY STATE ----------
  const [quantity, setQuantity] = useState(1); // User-chosen quantity

  // For image zoom
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        setProdLoading(true);
        const resolvedId = Array.isArray(id) ? id[0] : id;
        const prod = await getProductById(resolvedId);
        if (prod) {
          setProduct(prod as FirestoreProduct);
          const revs = await getReviewsForProduct(prod.id);
          setReviews(revs as ReviewData[]);
        }
      } catch (error) {
        console.error("Error loading product/reviews:", error);
      } finally {
        setProdLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // ---------- Handle Review Submit ----------
  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !product) return;

    const newReview: ReviewData = {
      userId: user.uid,
      username: user.displayName ?? "Anonymous",
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };

    try {
      await addReviewToProduct(product.id, newReview);
      const updated = await getReviewsForProduct(product.id);
      setReviews(updated as ReviewData[]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      console.error("Error adding review:", err);
    }
  }

  // ---------- Handle Image Zoom ----------
  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomPosition({ x, y });
  };

  // ---------- Loading States ----------
  if (authLoading || prodLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-20 h-20 border-t-4 border-b-4 border-yellow-400 border-solid rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-yellow-100">
        <p className="text-3xl font-semibold">Product not found</p>
      </div>
    );
  }

  // MAIN Image
  const mainImage = product.images?.[currentImageIndex] || "/placeholder.svg";
  
  // ---------- STOCK LOGIC ----------
  const stock = product.stock ?? 0;  // fallback
  const isOutOfStock = stock <= 0;

  // ---------- QUANTITY Input Handler ----------
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (val > stock) {
      // clamp to stock if user tries to exceed
      setQuantity(stock);
    } else if (val < 1) {
      // clamp min to 1
      setQuantity(1);
    } else {
      setQuantity(val);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-yellow-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-12"
        >
          {/* Image Gallery */}
          <div className="lg:w-1/2 space-y-4">
            <div
              ref={imageRef}
              className="relative aspect-square overflow-hidden rounded-2xl cursor-zoom-in shadow-lg"
              onMouseMove={handleImageZoom}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                src={mainImage}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className={`transition-transform duration-200 ${isZoomed ? "scale-150" : ""}`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                      }
                    : undefined
                }
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-20 border-2 rounded-xl cursor-pointer ${
                      idx === currentImageIndex ? "border-yellow-400" : "border-gray-700"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      className="rounded-xl"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200"
            >
              {product.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl text-yellow-300 font-light"
            >
              ${product.price.toFixed(2)}
            </motion.p>

            {/* ---------- STOCK DISPLAY ---------- */}
            {isOutOfStock ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-red-500 font-semibold text-lg"
              >
                Out of Stock
              </motion.p>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-green-400 text-lg"
              >
                In Stock: {stock}
              </motion.p>
            )}

            {/* OPTIONAL: Quantity Input if there's stock */}
            {!isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center space-x-2"
              >
                <label htmlFor="quantity" className="text-yellow-100 text-lg">
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 p-2 bg-gray-800 border border-gray-600 rounded text-center text-yellow-100"
                />
              </motion.div>
            )}

            {/* Category, Description, Features */}
            {product.category && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-400 text-lg"
              >
                Category: {product.category}
              </motion.p>
            )}
            {product.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-200 text-xl font-serif italic leading-relaxed"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.description}
              </motion.p>
            )}
            {product.features && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="list-none space-y-2 text-gray-300"
              >
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-yellow-400 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {/* If stock is 0, disable add to cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: mainImage,
                    // Use selected quantity
                    quantity,
                  })
                }
                disabled={isOutOfStock}
                className={`px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300
                  ${
                    isOutOfStock
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black"
                  }
                `}
              >
                <ShoppingCart size={24} />
                <span className="text-lg">{isOutOfStock ? "Unavailable" : "Add to Cart"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Heart size={24} className="text-red-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Share2 size={24} className="text-blue-400" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-20"
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-8">
            Customer Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-xl italic">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-8">
              {reviews.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-400 rounded-full p-3">
                      <User size={24} className="text-gray-900" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-yellow-200 font-semibold text-lg">{r.username}</p>
                        <p className="text-sm text-gray-500">
                          {r.createdAt?.toDate?.().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300 text-lg italic">{r.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Review Form */}
          {user ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              onSubmit={handleReviewSubmit}
              className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-lg space-y-6"
            >
              <h3 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                Write a Review
              </h3>
              <div>
                <label htmlFor="rating" className="block text-yellow-100 mb-2 text-lg">
                  Your Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <motion.button
                      key={num}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={num <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-yellow-100 mb-2 text-lg">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded-lg text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-lg"
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-8 py-3 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Review
              </motion.button>
            </motion.form>
          ) : (
            <p className="mt-12 text-gray-400 italic text-xl text-center">
              Please log in to write a review and share your experience.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
