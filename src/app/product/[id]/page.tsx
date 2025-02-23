"use client"
import React, { useState } from 'react';
import { Minus, Plus, Heart, Share2, Shield, Package, ArrowLeft, Star } from 'lucide-react';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

  const product = {
    name: "Celestial Diamond Engagement Ring",
    price: "$3,299",
    status: "In Stock",
    description: "A masterpiece of celestial beauty, this enchanting 18K white gold ring features a rare blue-tinted diamond centerpiece inspired by starlight. The floating halo design creates an ethereal effect, while hidden sapphire accents add a secret touch of something blue. Each ring is individually crafted by our master artisans in our atelier.",
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

  const handleAddToCart = () => {
    // Cart logic would go here
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black text-gray-100">
      {/* Navigation */}
      <div className="container mx-auto px-6 py-8">
        <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Celestial Collection
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 to-gray-900 shadow-2xl">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="object-cover w-full h-full transform transition-transform hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-blue-400 scale-95' : 'hover:ring-2 hover:ring-blue-400/50'
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
              <h1 className="text-4xl font-serif mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-blue-400 text-blue-400' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price and Status */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl text-blue-400 font-light">{product.price}</span>
                <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  Only {product.stock} left
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-blue-400">Features</h3>
              <ul className="space-y-3 text-gray-300">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
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
                  className="p-2 rounded-full border border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 rounded-full border border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => setIsWishlist(!isWishlist)}
                className={`p-4 rounded-lg border transition-all ${
                  isWishlist 
                    ? 'border-pink-400 bg-pink-400/10 text-pink-400' 
                    : 'border-gray-700 hover:border-pink-400'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlist ? 'fill-pink-400' : ''}`} />
              </button>
              <button className="p-4 rounded-lg border border-gray-700 hover:border-blue-400 hover:bg-blue-400/10 transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-800">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <Shield className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-medium">Secure Payment</h4>
                  <p className="text-sm text-gray-400">100% secure transaction</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <Package className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-medium">Premium Packaging</h4>
                  <p className="text-sm text-gray-400">Luxury gift box included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;