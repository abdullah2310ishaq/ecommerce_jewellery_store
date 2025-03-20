"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import {
  CalendarDays,
  Clock,
  Package,
  Search,
  TruckIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
} from "@/app/firebase/firebase_services/firestore";
import { firestore } from "@/app/firebase/firebase_services/firebaseConfig";

// Define a more specific type for the Firebase timestamp
type FirebaseTimestamp = {
  toDate: () => Date;
};

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  // We'll attach productImages once fetched.
  productImages?: string[];
}

interface OrderDoc {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: Date | FirebaseTimestamp;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Track which order is expanded
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Fetch all orders initially
  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await getAllOrders();
      console.log("Fetched orders:", data);

      // Convert Firebase timestamps to JS Date objects if needed
      const processedOrders = (data as OrderDoc[]).map((order) => ({
        ...order,
        createdAt:
          order.createdAt && "toDate" in order.createdAt
            ? order.createdAt.toDate()
            : new Date(order.createdAt),
      }));

      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status in Firestore and local state
  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  // Fetch product images for each item in an order
  async function fetchProductImagesForOrderItems(items: OrderItem[]) {
    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          // If we already have productImages, skip re-fetch
          if (item.productImages && item.productImages.length > 0) {
            return item;
          }

          // Otherwise, fetch from "products" collection:
          const productDocRef = doc(firestore, "products", item.productId);
          const productSnap = await getDoc(productDocRef);

          if (productSnap.exists()) {
            const productData = productSnap.data();
            const productImages = productData.images || [];
            return { ...item, productImages };
          } else {
            return { ...item, productImages: [] };
          }
        })
      );

      return updatedItems;
    } catch (error) {
      console.error("Error fetching product images:", error);
      return items; // fallback
    }
  }

  // Expand/collapse an order. On expand, fetch the product images if needed
  async function handleExpandOrder(orderId: string) {
    // If the same order is clicked again, collapse it
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    // Find the order in state
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Fetch product images only if not already fetched
    if (!order.items.some((i) => i.productImages && i.productImages.length)) {
      const updatedItems = await fetchProductImagesForOrderItems(order.items);

      // Update local state with the new items
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, items: updatedItems } : o
        )
      );
    }

    // Expand the selected order
    setExpandedOrder(orderId);
  }

  // Apply filters: status tab, time filter, search query
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }

    // Time filter
    if (timeFilter !== "all" && order.createdAt) {
      const orderDate =
        order.createdAt instanceof Date
          ? order.createdAt
          : order.createdAt.toDate();
      const today = new Date();

      if (timeFilter === "today") {
        if (
          orderDate.getDate() !== today.getDate() ||
          orderDate.getMonth() !== today.getMonth() ||
          orderDate.getFullYear() !== today.getFullYear()
        ) {
          return false;
        }
      } else if (timeFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        if (orderDate < weekAgo) {
          return false;
        }
      } else if (timeFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        if (orderDate < monthAgo) {
          return false;
        }
      }
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Get counts for order status badges
  const getStatusCount = (status: string) => {
    return orders.filter((order) => order.status === status).length;
  };

  // Get total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "Shipped":
        return <TruckIcon className="h-4 w-4 mr-1" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "Canceled":
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <Package className="h-4 w-4 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB6F90]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header & Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#FB6F90]">Order Management</h1>
          <p className="text-gray-600 mb-6">Easily manage and track all customer orders.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Orders</div>
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 mb-1">Pending</div>
              <div className="text-2xl font-bold">{getStatusCount("Pending")}</div>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 mb-1">Delivered</div>
              <div className="text-2xl font-bold">{getStatusCount("Delivered")}</div>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-[#FB6F90]">Rs. {totalRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or product..."
                className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB6F90]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-[180px]">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#FB6F90]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <CalendarDays className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Tabs for status filtering */}
        <div className="mb-6">
          <div className="flex flex-wrap border-b">
            {["all", "Pending", "Shipped", "Delivered", "Canceled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-b-2 border-[#FB6F90] text-[#FB6F90]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(tab)}`}>
                  {tab === "all" ? orders.length : getStatusCount(tab)}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            {/* If no results */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            Order #{order.id.slice(0, 8)}
                            {order.createdAt && (
                              <span className="ml-2 text-sm font-normal text-gray-500">
                                {format(
                                  order.createdAt instanceof Date ? order.createdAt : order.createdAt.toDate(),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.name} • {order.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(
                              order.status || "Pending"
                            )}`}
                          >
                            {getStatusIcon(order.status || "Pending")}
                            {order.status || "Pending"}
                          </div>
                          <select
                            value={order.status || "Pending"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB6F90]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Shipping Address:</span> {order.address}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Phone:</span> {order.phone}
                        </p>
                      </div>

                      {/* Expanded Section */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedOrder === order.id ? "max-h-[1000px]" : "max-h-0"
                        }`}
                      >
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="py-2 font-medium">Product</th>
                                <th className="py-2 font-medium">Price</th>
                                <th className="py-2 font-medium">Qty</th>
                                <th className="py-2 font-medium text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, idx) => {
                                const subtotal = item.price * item.quantity;
                                const hasImages = item.productImages && item.productImages.length > 0;

                                return (
                                  <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-2">
                                      {/* Show first product image if available */}
                                      <div className="flex items-start gap-2">
                                        {hasImages ? (
                                          <img
                                            src={item.productImages?.[0]}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                          />
                                        ) : (
                                          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                                            <Package className="h-6 w-6 text-gray-400" />
                                          </div>
                                        )}
                                        <div>
                                          <p className="font-medium text-gray-800">{item.name}</p>
                                          {/* If more images exist, show a small gallery or count */}
                                          {hasImages && item.productImages!.length > 1 && (
                                            <p className="text-xs text-gray-500 mt-1">
                                              +{item.productImages!.length - 1} more image
                                              {item.productImages!.length - 1 > 1 ? "s" : ""}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-2">Rs. {item.price.toFixed(2)}</td>
                                    <td className="py-2">{item.quantity}</td>
                                    <td className="py-2 text-right">Rs. {subtotal.toFixed(2)}</td>
                                  </tr>
                                );
                              })}
                              <tr className="font-medium">
                                <td colSpan={3} className="py-2 text-right">
                                  Total:
                                </td>
                                <td className="py-2 text-right text-[#FB6F90]">
                                  Rs. {order.totalAmount.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="px-4 py-2 bg-gray-50 flex justify-between border-t">
                      <div className="text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </div>
                      <button
                        className="text-sm text-[#FB6F90] hover:text-[#E85A7C] focus:outline-none"
                        onClick={() => handleExpandOrder(order.id)}
                      >
                        {expandedOrder === order.id ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
