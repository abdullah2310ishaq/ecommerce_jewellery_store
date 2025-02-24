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
    updateCartItem(itemId, newQty);
    setCartItems(getCart()); // re-fetch cart
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
      <div className="min-h-screen p-8 text-yellow-100 bg-black">
        <h1 className="text-2xl mb-4">Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-yellow-100 bg-black">
      <h1 className="text-3xl font-bold mb-6 text-yellow-300">Your Cart</h1>

      {/* CART ITEMS TABLE */}
      <table className="w-full text-left mb-6">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="pb-2">Product</th>
            <th className="pb-2">Quantity</th>
            <th className="pb-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-800">
              <td className="py-2">
                <div className="text-yellow-200">{item.name}</div>
              </td>
              <td className="py-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="w-16 p-1 bg-gray-800 border border-gray-700 rounded"
                />
              </td>
              <td className="py-2">${item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-6 text-yellow-300">
        Total: <strong>${totalAmount.toFixed(2)}</strong>
      </div>

      {/* CHECKOUT FORM */}
      <div className="max-w-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          placeholder="Shipping Address"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-20"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={handlePlaceOrder}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded font-medium"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
