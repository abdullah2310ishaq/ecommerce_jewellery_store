"use client";

import React, { useState } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  XCircle
} from "lucide-react";

const ShoppingCart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Celestial Diamond Engagement Ring",
      price: 3299,
      image: "/api/placeholder/120/120",
      quantity: 1,
      size: "6.5",
      metal: "18K White Gold"
    },
    {
      id: 2,
      name: "Sapphire Ocean Pendant",
      price: 1899,
      image: "/api/placeholder/120/120",
      quantity: 1,
      metal: "Platinum",
      chain: "18 inches"
    }
  ]);

  const [shippingMethod, setShippingMethod] = useState("standard");

  const shippingOptions = {
    standard: { price: 0, name: "Standard Shipping", time: "3-5 business days" },
    express: { price: 35, name: "Express Shipping", time: "1-2 business days" },
    overnight: { price: 75, name: "Overnight Delivery", time: "Next business day" }
  };

  // ====== Discount Code Feature ======
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyDiscount = () => {
    // Example: "SAVE10" gives a 10% discount
    if (discountCode.toUpperCase() === "SAVE10") {
      setDiscount(0.1); // 10% discount
    } else {
      setDiscount(0);
      alert("Invalid discount code.");
    }
  };

  // ====== Item Updates ======
  const updateQuantity = (id, change) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  // ====== Calculations ======
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingOptions[shippingMethod].price;
  const tax = subtotal * 0.0875; // 8.75% tax
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping + tax - discountAmount;

  // ====== Recommended Products (dummy data) ======
  const recommendedProducts = [
    {
      id: 11,
      name: "Golden Hoop Earrings",
      price: 799,
      image: "/api/placeholder/100/100"
    },
    {
      id: 12,
      name: "Emerald Crown Bracelet",
      price: 1299,
      image: "/api/placeholder/100/100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <button className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </button>
        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-3xl font-serif">
            Shopping Cart ({items.length} items)
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
              title="Clear Cart"
            >
              <XCircle className="w-5 h-5 mr-1" />
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-2xl text-gray-400 mb-6">Your cart is currently empty.</p>
          <button className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors font-medium">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex gap-6">
                    <div className="relative w-28 h-28 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-medium text-yellow-400">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.metal && <p>Metal: {item.metal}</p>}
                        {item.chain && <p>Chain Length: {item.chain}</p>}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded-full border border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded-full border border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xl">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Shipping Options */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-4">Shipping Method</h3>
                <div className="space-y-4">
                  {Object.entries(shippingOptions).map(([key, option]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={key}
                          checked={shippingMethod === key}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-gray-400">{option.time}</p>
                        </div>
                      </div>
                      <span>${option.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-4">Order Summary</h3>
                <div className="space-y-3 pb-4 border-b border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>${shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-yellow-400">
                      <span className="font-medium">Discount</span>
                      <span>-${(subtotal * discount).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-xl font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full mt-6 px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium transition-colors">
                  Proceed to Checkout
                </button>
              </div>

              
              <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                <label className="font-medium" htmlFor="discountCode">
                  Discount Code
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="discountCode"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter code (e.g. SAVE10)"
                  />
                  <button
                    onClick={applyDiscount}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50">
                  <Shield className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h4 className="font-medium">Secure Checkout</h4>
                    <p className="text-sm text-gray-400">SSL encrypted payment</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50">
                  <Truck className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h4 className="font-medium">Free Returns</h4>
                    <p className="text-sm text-gray-400">Within 30 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50">
                  <CreditCard className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h4 className="font-medium">Payment Options</h4>
                    <p className="text-sm text-gray-400">
                      All major cards accepted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="mt-16">
            <h2 className="text-2xl font-medium mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors flex items-center"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="ml-4 space-y-2">
                    <h3 className="text-lg text-yellow-400">{prod.name}</h3>
                    <p className="font-medium">${prod.price.toLocaleString()}</p>
                    <button className="text-sm text-gray-300 hover:text-yellow-300 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
