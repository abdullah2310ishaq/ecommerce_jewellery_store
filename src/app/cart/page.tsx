"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placeOrder } from "../firebase/firebase_services/firestore";
import { type CartItem, getCart, updateCartItem, clearCart } from "./cart";
import Swal from "sweetalert2";
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

  // Calculate the subtotal amount
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate additional fee if subtotal is between Rs.1200 and Rs.3000
  let additionalFee = 0;
  if (subtotal < 1200) {
    additionalFee = 0; // We'll block orders under 1200, so fee is irrelevant
  } else if (subtotal < 3000) {
    additionalFee = 200;
  } // else additionalFee remains 0 for free delivery (subtotal >=3000)

  // Final total
  const finalTotal = subtotal < 1200 ? 0 : subtotal + additionalFee;

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
    // Block order if subtotal is below minimum order amount
    if (subtotal < 1200) {
      Swal.fire({
        title: "Minimum Order Required",
        text: "The minimum order amount is Rs.1200. Please add more items.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    
    if (!name || !email || !phone || !address) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          popup: "bg-white text-gray-900",
          title: "text-[#FB6F90] font-bold",
          confirmButton:
            "bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded px-4 py-2",
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
        // Place order with final total (including additional fee)
        totalAmount: finalTotal,
        // You could include additional info about delivery fee if needed
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
          confirmButton:
            "bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded px-4 py-2",
        },
      });

      // Save order info in sessionStorage for confirmation page (optional)
      sessionStorage.setItem("orderId", orderId);
      sessionStorage.setItem("orderData", JSON.stringify(orderData));

      clearCart();
      setCartItems([]);

      // Redirect to confirmation page
      router.push("/cart/confirmation");
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
          confirmButton:
            "bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white rounded px-4 py-2",
        },
      });
    }
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-[#FB6F90]">
          Your Cart is Empty
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Looks like you havenot added any items to your cart yet.
        </p>
        <button 
          onClick={() => router.push('/')} 
          className="px-6 py-3 bg-[#FB6F90] hover:bg-[#FB6F90]/90 rounded-full font-medium transition-all duration-300 text-white"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 py-8 px-4 md:px-8">
      <header className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-[#FB6F90]">
          Your Shopping Cart
        </h1>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CART ITEMS SECTION */}
        <article className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg">
          <header className="mb-6 border-b pb-2">
            <h2 className="text-2xl font-semibold text-[#FB6F90]">
              Cart Items
            </h2>
          </header>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col md:flex-row items-center py-6"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-[#FB6F90]">{item.name}</h3>
                  <p className="text-gray-700 mt-1">Rs. {item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-4 my-4 md:my-0">
                  <button 
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full transition-colors"
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
                    className="w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full transition-colors"
                  >
                    <span className="text-2xl">+</span>
                  </button>
                </div>
                <aside className="flex flex-col items-end">
                  <p className="font-semibold text-xl">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="mt-2 text-red-400 text-sm hover:text-red-300"
                  >
                    Remove
                  </button>
                </aside>
              </li>
            ))}
          </ul>
          <footer className="mt-8 text-right">
            <div className="text-2xl font-bold text-[#FB6F90]">
              Subtotal: Rs. {subtotal.toFixed(2)}
            </div>
            {subtotal < 1200 ? (
              <p className="mt-2 text-lg text-red-500 font-bold">
                Minimum order is Rs.1200
              </p>
            ) : subtotal < 3000 ? (
              <p className="mt-2 text-lg text-gray-700">
                Additional delivery fee: Rs.200
              </p>
            ) : (
              <p className="mt-2 text-lg text-green-600 font-bold">
                Free Delivery!
              </p>
            )}
            <div className="text-2xl font-bold text-[#FB6F90] mt-4">
              Final Total: Rs. {finalTotal.toFixed(2)}
            </div>
          </footer>
        </article>

        {/* CHECKOUT FORM */}
        <aside className="bg-white rounded-2xl p-8 shadow-lg h-fit">
          <header className="mb-6 border-b pb-2">
            <h2 className="text-2xl font-semibold text-[#FB6F90]">
              Checkout Details
            </h2>
          </header>
          <div className="space-y-4">
            <div>
              <label className="block text-lg mb-2 text-gray-900">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-lg mb-2 text-gray-900">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-lg mb-2 text-gray-900">
                Phone
              </label>
              <input
                type="text"
                placeholder="Your contact number"
                className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-lg mb-2 text-gray-900">
                Shipping Address
              </label>
              <textarea
                placeholder="Enter your complete address"
                className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg h-28 focus:ring-2 focus:ring-[#FB6F90] focus:outline-none transition-all"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <footer className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="px-8 py-4 bg-[#FB6F90] hover:bg-[#FB6F90]/90 rounded-lg font-medium text-white transition-all duration-300 shadow-xl"
              >
                Place Order
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentInfo(true)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <Info size={24} className="text-[#FB6F90]" />
              </button>
            </footer>
          </div>
        </aside>
      </section>
      <AnimatePresence>
        {showPaymentInfo && (
          <PaymentInfo onClose={() => setShowPaymentInfo(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
