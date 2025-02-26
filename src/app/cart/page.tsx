"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placeOrder } from "../firebase/firebase_services/firestore";
import { CartItem, getCart, updateCartItem, clearCart } from "./cart";

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Reload cart on mount
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Recalculate total
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Update quantity
  function handleQuantityChange(itemId: string, newQty: number) {
    if (newQty >= 1) {
      updateCartItem(itemId, newQty);
      setCartItems(getCart()); // re-fetch cart
    }
  }

  // Remove item
  function handleRemoveItem(itemId: string) {
    updateCartItem(itemId, 0);
    setCartItems(getCart());
  }

  async function handlePlaceOrder() {
    if (!name || !email || !phone || !address) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Construct order data matching your interface
      const orderData = {
        name,
        email,
        phone,
        address,
        items: cartItems.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount,
      };
      const orderId = await placeOrder(orderData);
      alert(`Order placed successfully! Order ID: ${orderId}`);
      clearCart();
      setCartItems([]);
      // Optionally navigate somewhere (e.g. /orders or /thank-you)
      // router.push("/thank-you?orderId=" + orderId);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen p-8 text-yellow-100 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-3xl font-bold mb-4 text-yellow-300">Your Cart is Empty</h1>
          <p className="mb-8">Looks like you haven't added any items to your cart yet.</p>
          <button 
            onClick={() => router.push('/')} 
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-full font-medium transition-all duration-300 shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-yellow-100 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-300">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS SECTION */}
          <div className="lg:col-span-2 bg-gray-900 bg-opacity-60 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-yellow-200">Cart Items</h2>
            
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center py-4 border-b border-gray-800">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-yellow-200">{item.name}</h3>
                  <p className="text-yellow-100">${item.price.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <span className="text-xl">-</span>
                  </button>
                  
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
                
                <div className="ml-6 text-right">
                  <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-400 text-sm hover:text-red-300 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="mt-6 text-right">
              <div className="text-xl font-bold text-yellow-300">
                Total: ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <div className="bg-gray-900 bg-opacity-60 rounded-xl p-6 shadow-xl h-fit">
            <h2 className="text-xl font-semibold mb-4 text-yellow-200">Checkout Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="Your contact number"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Shipping Address</label>
                <textarea
                  placeholder="Enter your complete address"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg h-24 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full px-6 py-4 mt-4 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium text-black transition-all duration-300 shadow-lg"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}