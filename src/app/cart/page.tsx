"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placeOrder } from "../firebase/firebase_services/firestore";
import { CartItem, getCart, updateCartItem, clearCart } from "./cart";
import {useToast} from "vyrn";
import Swal from "sweetalert2";
export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
const toast = useToast();
  // Load cart items on mount
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Update quantity
  function handleQuantityChange(itemId: string, newQty: number) {
    if (newQty >= 1) {
      updateCartItem(itemId, newQty);
      setCartItems(getCart());
    }
  }

  // Remove item from cart
  function handleRemoveItem(itemId: string) {
    updateCartItem(itemId, 0);
    setCartItems(getCart());
  }

  async function handlePlaceOrder() {
    if (!name || !email || !phone || !address) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all fields.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      
      return;
    }

    try {
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
      Swal.fire({
        title: "Order Placed!",
        text: `Order placed successfully! Order ID: ${orderId}`,
        icon: "success",
        confirmButtonText: "OK",
      });
       clearCart();
      setCartItems([]);
      // router.push("/thank-you?orderId=" + orderId); // Optional navigation
    } catch (error) {
      console.error("Error placing order:", error);
    Swal.fire({
  title: "Error!",
  text: "Failed to place order. Please try again.",
  icon: "error",
  confirmButtonText: "OK",
});
}
  }

  // If cart is empty, show a friendly empty state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900">
        <h1 className="text-3xl font-bold mb-4 text-yellow-300">Your Cart is Empty</h1>
        <p className="text-lg text-gray-400 mb-8">
          Looks like you havenot added any items to your cart yet.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-full font-medium transition-all duration-300 shadow-xl"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-100 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-yellow-300 text-center">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* CART ITEMS SECTION */}
          <div className="lg:col-span-2 bg-gray-800 bg-opacity-70 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-yellow-200 border-b pb-2">
              Cart Items
            </h2>
            <div className="divide-y divide-gray-700">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center py-6"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-yellow-200">
                      {item.name}
                    </h3>
                    <p className="text-yellow-100 mt-1">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 my-4 md:my-0">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <span className="text-2xl">−</span>
                    </button>
                    <span className="w-12 text-center text-xl font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-xl">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-2 text-red-400 text-sm hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-right">
              <span className="text-2xl font-bold text-yellow-300">
                Total: ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <div className="bg-gray-800 bg-opacity-70 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-yellow-200 border-b pb-2">
              Checkout Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg mb-2 text-yellow-100">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-lg mb-2 text-yellow-100">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-lg mb-2 text-yellow-100">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Your contact number"
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-lg mb-2 text-yellow-100">
                  Shipping Address
                </label>
                <textarea
                  placeholder="Enter your complete address"
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg h-28 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full px-8 py-4 mt-4 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium text-black transition-all duration-300 shadow-xl"
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
