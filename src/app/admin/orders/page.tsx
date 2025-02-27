"use client";

import { getAllOrders, updateOrderStatus } from "@/app/firebase/firebase_services/firestore";
import React, { useEffect, useState } from "react";

interface OrderDoc {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt?: Date; // if we stored serverTimestamp
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await getAllOrders();
      console.log("Fetched orders:", data);
      // Cast to our interface
      setOrders(data as OrderDoc[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert(`Order ${orderId} status updated to ${newStatus}`);
      // refresh orders
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen text-yellow-100 bg-black p-8">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen text-yellow-100 bg-black p-8">
        <h1 className="text-2xl mb-4">No Orders Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-yellow-100 bg-black p-8">
      <h1 className="text-3xl font-bold mb-4">All Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-700 p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
              <select
                value={order.status || "Pending"}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value)
                }
                className="bg-gray-800 text-yellow-100 px-2 py-1 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            <p className="text-sm text-gray-300 mb-2">
              Placed by: {order.name} | {order.email} | {order.phone}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              Address: {order.address}
            </p>

            <table className="w-full text-left bg-black">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2">Product</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">${item.price}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">
                      ${item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-2 text-yellow-300 font-medium">
              Total: ${order.totalAmount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
