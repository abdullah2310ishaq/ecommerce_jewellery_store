"use client";
import React, { useState } from "react";
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

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showEngraving, setShowEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState("");
  const [show360Preview, setShow360Preview] = useState(false);

  const product = {
    name: "Celestial Diamond Engagement Ring",
    price: "$3,299",
    status: "In Stock",
    description:
      "A masterpiece of celestial beauty, this enchanting 18K white gold ring features a rare blue-tinted diamond centerpiece inspired by starlight. The floating halo design creates an ethereal effect, while hidden sapphire accents add a secret touch of something blue. Each ring is individually crafted by our master artisans in our atelier.",
    details: [
      "Center Diamond: 1.5 carat, VVS1 clarity, rare blue tint",
      "Floating Halo: 0.75 total carat weight",
      "Hidden Sapphires: 0.25 total carat weight",
      "Metal: 18K White Gold with rhodium finish",
      "Ring Size: Custom sized to order",
      "Certificate: GIA Certified with Blockchain Authentication"
    ],
    images: [
      "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.9,
    reviews: 256,
    stock: 3
  };

  // Dummy "Similar Products" Data
  const similarProducts = [
    {
      id: 1,
      name: "Golden Hoop Earrings",
      price: "$799",
      img: "https://images.pexels.com/photos/11914482/pexels-photo-11914482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: 2,
      name: "Diamond Infinity Bracelet",
      price: "$1,299",
      img: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  const handleAddToCart = () => {
    let message = `Added ${product.name} (x${quantity}) to cart.`;
    if (engravingText) {
      message += ` Engraving: "${engravingText}"`;
    }
    alert(message);
  };

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

      {/* Navigation */}
      <div className="container mx-auto px-6 py-8">
        <button className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Celestial Collection
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-black to-gray-900 shadow-2xl">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-105"
              />
            </div>
            {/* Thumbnail Images */}
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
                    const isFilled = i < Math.round(product.rating);
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
                <span className="text-gray-400">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price and Stock Status */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl text-yellow-400 font-light">
                  {product.price}
                </span>
                <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  Only {product.stock} left
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Status:{" "}
                <span className="text-yellow-400 font-medium">
                  {product.status}
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Product Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-yellow-400">Features</h3>
              <ul className="space-y-3 text-gray-300">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-6">
              <span className="text-lg">Quantity:</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-full border border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
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

        {/* Similar Products */}
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
                <p className="text-gray-300 text-sm">{item.price}</p>
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
};

export default ProductDetail;
