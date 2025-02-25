"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { addToCart } from "@/app/cart/cart";
import { useAuth } from "@/app/context/AuthContext";  
import {
  getProductById,
  getReviewsForProduct,
  addReviewToProduct,
} from "@/app/firebase/firebase_services/firestore";
import { Timestamp } from "firebase/firestore";

interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
}

interface ReviewData {
  id?: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt?: Timestamp; // Must be optional
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();  // from AuthContext
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [prodLoading, setProdLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        setProdLoading(true);
        const resolvedId = Array.isArray(id) ? id[0] : id;
        const prod = await getProductById(resolvedId);
        if (prod) {
          setProduct(prod as FirestoreProduct);
          // fetch reviews
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

  // Add new review
  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to review");
      return;
    }
    if (!product) return;

    const newReview: ReviewData = {
      userId: user.uid,
      username: user.displayName ?? "Anonymous",
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };

    try {
      await addReviewToProduct(product.id, newReview);
      alert("Review added!");
      // Re-fetch reviews
      const updated = await getReviewsForProduct(product.id);
      setReviews(updated as ReviewData[]);
      // Reset form
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      console.error("Error adding review:", err);
    }
  }

  if (authLoading || prodLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Product not found</p>
      </div>
    );
  }

  const mainImage = product.images?.[0] || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-black text-yellow-100 p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="flex-1">
          <div className="relative aspect-square mb-4">
            <Image src={mainImage} alt={product.name} fill className="object-cover rounded" />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 border border-yellow-600">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-yellow-400">{product.name}</h1>
          <p className="text-lg text-yellow-300">${product.price}</p>
          {product.description && (
            <p className="text-gray-200">{product.description}</p>
          )}

          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: mainImage,
                quantity: 1,
              })
            }
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-black rounded font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-gray-900 p-3 rounded">
                <p className="text-yellow-200 font-semibold">
                  {r.username}{" "}
                  <span className="text-sm text-gray-500">
                    {r.createdAt?.toDate?.().toLocaleString()}
                  </span>
                </p>
                <p className="text-yellow-400">Rating: {r.rating} / 5</p>
                <p className="text-gray-300">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="mt-6 bg-gray-800 p-4 rounded space-y-3">
            <h3 className="text-xl font-semibold text-yellow-200">Add Review</h3>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="w-full p-2 bg-gray-900 rounded"
              placeholder="Your review..."
              rows={3}
            />
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="w-full p-2 bg-gray-900 rounded"
            >
              {[5,4,3,2,1].map(num => (
                <option key={num} value={num}>{num} Star{num>1?"s":""}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded font-medium"
            >
              Submit
            </button>
          </form>
        ) : (
          <p className="mt-4 text-gray-400">
            <em>Please log in to write a review.</em>
          </p>
        )}
      </div>
    </div>
  );
}
