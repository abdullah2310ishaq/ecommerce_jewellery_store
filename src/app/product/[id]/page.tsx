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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-t-4 border-b-4 border-[#FB6F90] rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
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
    <div className="min-h-screen bg-white text-gray-900 p-8">
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
                      idx === currentImageIndex ? "border-[#FB6F90]" : "border-gray-300"
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
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FB6F90] to-[#FB6F90]"
            >
              {product.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl text-[#FB6F90] font-light"
            >
              Rs. {product.price.toFixed(2)}
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
                className="text-green-600 text-lg"
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
                <span className="text-lg text-gray-900">Quantity:</span>
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-[#FB6F90] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="px-4 py-2 text-lg text-gray-900">{quantity}</div>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= stock}
                    className="px-3 py-2 text-[#FB6F90] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
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
                className="text-gray-700 text-lg"
              >
                Category: {product.category}
              </motion.p>
            )}
            {product.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-700 text-xl font-serif italic leading-relaxed"
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
                className="list-none space-y-2 text-gray-600"
              >
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-[#FB6F90] mr-2">•</span>
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
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FB6F90] to-[#FB6F90] text-white"
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
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FB6F90] to-[#FB6F90] mb-8">
            Customer Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600 text-xl italic">
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
                  className="bg-gray-50 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FB6F90] rounded-full p-3">
                      <User size={24} className="text-white" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[#FB6F90] font-semibold text-lg">{r.username}</p>
                        <p className="text-sm text-gray-500">
                          {r.createdAt?.toDate?.().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={i < r.rating ? "text-[#FB6F90] fill-[#FB6F90]" : "text-gray-400"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-lg italic">{r.comment}</p>
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
              className="mt-12 bg-gray-50 p-8 rounded-2xl shadow-lg space-y-6"
            >
              <h3 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FB6F90] to-[#FB6F90]">
                Write a Review
              </h3>
              <div>
                <label htmlFor="rating" className="block text-gray-900 mb-2 text-lg">
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
                            ? "text-[#FB6F90] fill-[#FB6F90]"
                            : "text-gray-400"
                        }
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-gray-900 mb-2 text-lg">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  className="w-full p-3 bg-gray-100 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FB6F90] text-lg"
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-[#FB6F90] to-[#FB6F90] text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Review
              </motion.button>
            </motion.form>
          ) : (
            <p className="mt-12 text-gray-600 italic text-xl text-center">
              Please log in to write a review and share your experience.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
