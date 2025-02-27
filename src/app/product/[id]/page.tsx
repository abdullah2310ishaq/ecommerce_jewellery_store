"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { useAuth } from "@/app/context/AuthContext";
import {
  getProductById,
  getReviewsForProduct,
  addReviewToProduct,
} from "@/app/firebase/firebase_services/firestore";
import type { Timestamp } from "firebase/firestore";
import { Star, ShoppingCart, User, Plus, Minus } from "lucide-react";

import { addToCart } from "@/app/cart/cart";

interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string[];
  features?: string[];
  category?: string;
  stock?: number;
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

  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [prodLoading, setProdLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        setProdLoading(true);
        // Resolve id (if it's an array, take the first element) and assert it is a string.
        const resolvedId = Array.isArray(id) ? id[0] : id!;
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

      Swal.fire({
        title: "Success!",
        text: "Review submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Error adding review:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit review. Try again!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomPosition({ x, y });
  };

  if (authLoading || prodLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-t-4 border-b-4 border-yellow-400 rounded-full"
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

  const mainImage = product.images?.[currentImageIndex] || "/placeholder.svg";
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleIncrement = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-yellow-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Product Images & Info */}
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
                fill
                className={`object-cover transition-transform duration-200 ${isZoomed ? "scale-150" : ""}`}
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
                      fill
                      className="object-cover rounded-xl"
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

            {/* Stock Display */}
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

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center space-x-4"
              >
                <span className="text-lg text-yellow-100">Quantity:</span>
                <div className="flex items-center bg-gray-800 border border-gray-600 rounded">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="px-4 py-2 text-lg text-yellow-100">{quantity}</div>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= stock}
                    className="px-3 py-2 text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    <Plus size={20} />
                  </button>
                </div>
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

            {/* Add to Cart Button */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Call addToCart with only one argument
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: mainImage,
                    quantity,
                  });
                }}
                disabled={isOutOfStock}
                className={`px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isOutOfStock
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black"
                }`}
              >
                <ShoppingCart size={24} />
                <span className="text-lg">{isOutOfStock ? "Unavailable" : "Add to Cart"}</span>
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
                        className={
                          num <= reviewForm.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }
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