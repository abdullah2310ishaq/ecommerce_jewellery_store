"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
}

export default function OrderConfirmation() {
  const router = useRouter();

  // These would normally come from a server, or be passed via state or query params
  const [orderId, setOrderId] = useState<string>("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Example: Retrieve order details from sessionStorage (or any global state)
    // For a real implementation, fetch from your backend using the order ID from query params.
    const storedOrderId = sessionStorage.getItem("orderId");
    const storedOrderData = sessionStorage.getItem("orderData");
    if (storedOrderId && storedOrderData) {
      setOrderId(storedOrderId);
      setOrderData(JSON.parse(storedOrderData));
    } else {
      // If no order details found, navigate back home.
      router.push("/home");
    }
  }, [router]);

  if (!orderData) {
    return null; // Or a loading spinner
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4">
      <section className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#FB6F90]">Order Confirmation</h1>
          <p className="text-gray-700 mt-2">
            Your order has been placed successfully!
          </p>
          <p className="text-md font-medium text-gray-600 mt-1">
            Order ID: <span className="font-bold">{orderId}</span>
          </p>
        </header>
        <article className="border-t pt-4">
          <h2 className="text-xl font-semibold text-[#FB6F90] mb-2">Order Details</h2>
          <p className="mb-1">
            <strong>Name:</strong> {orderData.name}
          </p>
          <p className="mb-1">
            <strong>Email:</strong> {orderData.email}
          </p>
          <p className="mb-1">
            <strong>Phone:</strong> {orderData.phone}
          </p>
          <p className="mb-1">
            <strong>Address:</strong> {orderData.address}
          </p>
          <h3 className="text-lg font-semibold text-[#FB6F90] mt-4">Items:</h3>
          <ul className="list-disc ml-6">
            {orderData.items.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {item.name} x {item.quantity} - Rs.{" "}
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-bold text-[#FB6F90]">
            Total: Rs.{orderData.totalAmount.toFixed(2)}
          </p>
        </article>
        <footer className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/home")}
            className="bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white font-bold py-2 px-6 rounded"
          >
            Continue Shopping
          </button>
        </footer>
      </section>
    </main>
  );
}
