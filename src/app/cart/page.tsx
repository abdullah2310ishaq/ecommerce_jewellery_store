"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { placeOrder } from "../firebase/firebase_services/firestore";
import { type CartItem, getCart, updateCartItem, clearCart } from "./cart";
import Swal from "sweetalert2";
import Link from "next/link";
import { Info } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import PaymentInfo from "./PaymentInfo";

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  // Load cart items on mount
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update quantity
  function handleQuantityChange(itemId: string, newQty: number) {
    if (newQty >= 1) {
      updateCartItem(itemId, newQty);
      setCartItems(getCart());
    }
  }
//hide
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
        customClass: {
          popup: "bg-white text-gray-900",
          title: "text-[#FB6F90] font-bold",
          confirmButton: "bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded px-4 py-2",
        },
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

      // Place the order in Firestore
      const orderId = await placeOrder(orderData);

      // Send order confirmation email
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderData, orderId }),
      });

      Swal.fire({
        title: "Order Placed!",
        text: `Order placed successfully! Order ID: ${orderId}`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "bg-white text-gray-900",
          title: "text-[#FB6F90] font-bold",
          confirmButton: "bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded px-4 py-2",
        },
      });

      clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to place order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "bg-white text-gray-900",
          title: "text-[#FB6F90] font-bold",
          confirmButton: "bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded px-4 py-2",
        },
      });
    }
  }


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-[#FB6F90]">Your Cart is Empty</h1>
        <p className="text-lg text-gray-700 mb-8">
          Looks like you have not added any items to your cart yet.
        </p>
        <button
          onClick={() => router.push("/home")}
          className="px-6 py-3 bg-[#FB6F90] hover:bg-[#FB6F90]/90 rounded-full font-medium transition-all duration-300 text-white"
        >
          Continue Shopping

        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#FB6F90]">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* CART ITEMS SECTION */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#FB6F90] border-b pb-2">
              Cart Items
            </h2>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center py-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-[#FB6F90]">{item.name}</h3>
                    <p className="text-gray-700 mt-1">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-4 my-4 md:my-0">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full transition-colors"
                    >
                      <span className="text-2xl">−</span>
                    </button>
                    <span className="w-12 text-center text-xl font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full transition-colors"
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
              <span className="text-2xl font-bold text-[#FB6F90]">
                Total: ${totalAmount.toFixed(2)}
              </span>
              <p className="mt-2 text-lg text-gray-700">
                Get 10% discount!
                <Link
                  href="https://wa.me/923345751822"
                  className="text-[#FB6F90] hover:underline ml-1"
                >
                  WhatsApp us on 03345751822
                </Link>
              </p>
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#FB6F90] border-b pb-2">
              Checkout Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg mb-2 text-gray-900">Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-lg mb-2 text-gray-900">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-lg mb-2 text-gray-900">Phone</label>
                <input
                  type="text"
                  placeholder="Your contact number"
                  className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-lg mb-2 text-gray-900">Shipping Address</label>
                <textarea
                  placeholder="Enter your complete address"
                  className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg h-28 focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handlePlaceOrder}
                  className="px-8 py-4 bg-[#FB6F90] hover:bg-[#FB6F90]/90 rounded-lg font-medium text-white transition-all duration-300"
                >
                  Place Order
                </button>
                <button
                  onClick={() => setShowPaymentInfo(true)}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <Info size={24} className="text-[#FB6F90]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPaymentInfo && <PaymentInfo onClose={() => setShowPaymentInfo(false)} />}
      </AnimatePresence>
    </div>
  );
}
