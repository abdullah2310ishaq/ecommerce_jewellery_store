"use client";

import React, { useState } from "react";

export default function CheckoutForm({ cartItems, totalAmount }: { cartItems: any[], totalAmount: number }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    country: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      guestEmail: formData.email,
      guestPhone: formData.phone,
      items: cartItems,
      totalAmount,
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
        country: formData.country
      },
      status: "Pending"
    };

    try {
      await createOrder(orderData);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg text-gray-100">
      <h2 className="text-xl font-semibold text-yellow-400">Guest Checkout</h2>
      
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
      />

      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        value={formData.postalCode}
        onChange={handleChange}
        required
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
      />

      <input
        type="text"
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleChange}
        required
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
      />

      <button
        type="submit"
        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 rounded w-full"
      >
        Place Order
      </button>
    </form>
  );
}
