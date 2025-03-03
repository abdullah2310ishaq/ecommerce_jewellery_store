"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { getAllOrders, getAllProducts } from "@/app/firebase/firebase_services/firestore";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// --------------------------------
// Data Interfaces
// --------------------------------

// Global product interface (from Firestore)
interface Product {
  id: string;
  name: string;
  price: number;       // Selling Price
  costPrice: number;   // Default Cost Price
  category: string;
  description: string;
  imageUrl: string;
}

// Order item & order interfaces
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}

// Firestore versions (to allow timestamp conversion)
interface FirestoreOrder {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: Date | { toDate: () => Date };
}

interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  costPrice?: number;
  category?: string;
  description?: string;
  imageUrl?: string;
}

// Overall analytics per product (global table does NOT include profit details)
interface ProductAnalytics extends Product {
  totalOrdered: number;
  totalRevenue: number;
  totalProfit: number; // Add the missing property
  // Note: profit column is removed from the global analytics table per instructions.
}

// Detailed profit calculator interface.
interface SingleProductProfitDetails {
  productName: string;
  sellingPrice: number;
  costPrice: number;       // Overridden cost price (for single product) OR default costPrice for "All Products"
  quantitySold: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;    // (totalProfit / totalRevenue) * 100
}

// --------------------------------
// Combined Analytics & Detailed Profit Calculator Page
// --------------------------------

export default function CombinedProfitAnalyticsPage() {
  // Global data states.
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Global filters & sorting.
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("totalRevenue");
  const [sortOrder, setSortOrder] = useState("desc");

  // Detailed Profit Calculator states.
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [inputCostPrice, setInputCostPrice] = useState<string>("");
  const [detailedTimeFilter, setDetailedTimeFilter] = useState("all");
  // For a single product selection:
  const [detailedProfitDetails, setDetailedProfitDetails] = useState<SingleProductProfitDetails | null>(null);
  // For "All Products" selection:
  const [aggregatedProfitDetails, setAggregatedProfitDetails] = useState<SingleProductProfitDetails[] | null>(null);

  // --------------------------------
  // Data Fetching & Processing
  // --------------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
        ]);

        // Convert Firestore timestamps to JS Dates.
        const processedOrders: Order[] = (ordersData as FirestoreOrder[]).map(order => ({
          ...order,
          createdAt: order.createdAt instanceof Date ? order.createdAt : order.createdAt.toDate(),
        }));
        setOrders(processedOrders);

        // Process products – mapping "price" as selling price.
        const processedProducts: Product[] = (productsData as FirestoreProduct[]).map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          costPrice: product.costPrice ?? 0,
          category: product.category ?? "",
          description: product.description ?? "",
          imageUrl: product.imageUrl ?? "/placeholder.svg",
        }));
        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --------------------------------
  // Global Order Filtering by Time
  // --------------------------------
  function filterOrdersByTime(orders: Order[], filter: string): Order[] {
    const now = new Date();
    switch (filter) {
      case "today":
        return orders.filter(order => order.createdAt.toDateString() === now.toDateString());
      case "week":
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orders.filter(order => order.createdAt >= oneWeekAgo);
      case "month":
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return orders.filter(order => order.createdAt >= oneMonthAgo);
      default:
        return orders;
    }
  }

  // --------------------------------
  // Compute Global Product Analytics (without profit column)
  // --------------------------------
  useEffect(() => {
    const filteredOrders = filterOrdersByTime(orders, timeFilter);
    const analyticsMap: { [key: string]: ProductAnalytics } = {};

    products.forEach(product => {
      analyticsMap[product.id] = {
        ...product,
        totalOrdered: 0,
        totalRevenue: 0,
        totalProfit: 0, // This won't be displayed in global table.
      };
    });

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (analyticsMap[item.productId]) {
          analyticsMap[item.productId].totalOrdered += item.quantity;
          analyticsMap[item.productId].totalRevenue += item.price * item.quantity;
          analyticsMap[item.productId].totalProfit += (item.price - analyticsMap[item.productId].costPrice) * item.quantity;
        }
      });
    });

    setProductAnalytics(Object.values(analyticsMap));
  }, [products, orders, timeFilter]);

  // Sorting for global analytics.
  const sortedProductAnalytics = [...productAnalytics].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy as keyof ProductAnalytics] > b[sortBy as keyof ProductAnalytics] ? 1 : -1;
    } else {
      return a[sortBy as keyof ProductAnalytics] < b[sortBy as keyof ProductAnalytics] ? 1 : -1;
    }
  });

  // Global Summary Statistics.
  const totalRevenue = productAnalytics.reduce((sum, product) => sum + product.totalRevenue, 0);
  const totalProfit = productAnalytics.reduce((sum, product) => sum + product.totalProfit, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // --------------------------------
  // Detailed Profit Calculator Logic
  // --------------------------------

  // When a product is selected, update cost price field.
  useEffect(() => {
    if (selectedProductId) {
      if (selectedProductId === "all") {
        setInputCostPrice("");
        setDetailedProfitDetails(null);
        setAggregatedProfitDetails(null);
      } else {
        const foundProduct = products.find(p => p.id === selectedProductId);
        if (foundProduct) {
          setInputCostPrice(foundProduct.costPrice.toString());
          setDetailedProfitDetails(null);
          setAggregatedProfitDetails(null);
        }
      }
    }
  }, [selectedProductId, products]);

  const handleCalculateProfit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId) return;

    // If "All Products" is selected, aggregate detailed profit for each product.
    if (selectedProductId === "all") {
      const detailedOrders = filterOrdersByTime(orders, detailedTimeFilter);
      const results: SingleProductProfitDetails[] = [];
      products.forEach(product => {
        let totalQuantity = 0;
        let totalRev = 0;
        detailedOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.productId === product.id) {
              totalQuantity += item.quantity;
              totalRev += item.price * item.quantity;
            }
          });
        });
        const totProfit = (product.price - product.costPrice) * totalQuantity;
        const margin = totalRev > 0 ? (totProfit / totalRev) * 100 : 0;
        results.push({
          productName: product.name,
          sellingPrice: product.price,
          costPrice: product.costPrice,
          quantitySold: totalQuantity,
          totalRevenue: totalRev,
          totalProfit: totProfit,
          profitMargin: margin,
        });
      });
      setAggregatedProfitDetails(results);
    } else {
      // Single product detailed calculation using admin-provided cost price.
      const userCostPrice = parseFloat(inputCostPrice);
      if (isNaN(userCostPrice)) {
        alert("Please enter a valid cost price.");
        return;
      }
      const selectedProduct = products.find(p => p.id === selectedProductId);
      if (!selectedProduct) return;
      const detailedOrders = filterOrdersByTime(orders, detailedTimeFilter);
      let totalQuantity = 0;
      let totalRev = 0;
      detailedOrders.forEach(order => {
        order.items.forEach(item => {
          if (item.productId === selectedProductId) {
            totalQuantity += item.quantity;
            totalRev += item.price * item.quantity;
          }
        });
      });
      const totProfit = (selectedProduct.price - userCostPrice) * totalQuantity;
      const margin = totalRev > 0 ? (totProfit / totalRev) * 100 : 0;
      const details: SingleProductProfitDetails = {
        productName: selectedProduct.name,
        sellingPrice: selectedProduct.price,
        costPrice: userCostPrice,
        quantitySold: totalQuantity,
        totalRevenue: totalRev,
        totalProfit: totProfit,
        profitMargin: margin,
      };
      setDetailedProfitDetails(details);
      setAggregatedProfitDetails(null);
    }
  };

  // --------------------------------
  // Render Page
  // --------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Global Summary Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#FB6F90]">Jewelry Store Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. {totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#FB6F90]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-[#FB6F90]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                <p className="text-2xl font-bold">Rs. {averageOrderValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#FB6F90]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Profit</p>
                <p className="text-2xl font-bold">Rs. {totalProfit.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-[#FB6F90]" />
            </div>
          </div>
        </section>

        {/* Global Filters & Product Analytics Table */}
        <section className="mb-12">
          <header className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <label htmlFor="timeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Global Time Period
                </label>
                <select
                  id="timeFilter"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-[#FB6F90] focus:border-[#FB6F90] sm:text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-[#FB6F90] focus:border-[#FB6F90] sm:text-sm"
                >
                  <option value="totalRevenue">Total Revenue</option>
                  <option value="totalProfit">Total Profit</option>
                  <option value="totalOrdered">Total Ordered</option>
                </select>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="inline-flex items-center px-4 py-2 bg-[#FB6F90] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB6F90]"
              >
                {sortOrder === "asc" ? <ArrowUp className="mr-2 h-4 w-4" /> : <ArrowDown className="mr-2 h-4 w-4" />}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </header>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ordered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProductAnalytics.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={product.imageUrl} alt={product.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {product.costPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.totalOrdered}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {product.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Profit Calculator Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Detailed Profit Calculator</h2>
          <form onSubmit={handleCalculateProfit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">-- Choose a Product --</option>
                <option value="all">All Products</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Selling: Rs. {product.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            {selectedProductId !== "all" && (
              <div>
                <label className="block text-sm font-medium mb-1">Cost Price Override</label>
                <input
                  type="number"
                  value={inputCostPrice}
                  onChange={(e) => setInputCostPrice(e.target.value)}
                  className="p-2 border rounded w-full"
                  placeholder="Enter cost price"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Time Period</label>
              <select
                value={detailedTimeFilter}
                onChange={(e) => setDetailedTimeFilter(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <button
              type="submit"
              className="md:col-span-3 mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Calculate Detailed Profit
            </button>
          </form>
          {/* Render detailed profit table */}
          {selectedProductId === "all" && aggregatedProfitDetails && aggregatedProfitDetails.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-xl font-bold mb-2">Detailed Profit for All Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border">Product</th>
                      <th className="py-2 px-4 border">Selling Price</th>
                      <th className="py-2 px-4 border">Quantity Sold</th>
                      <th className="py-2 px-4 border">Total Revenue</th>
                      <th className="py-2 px-4 border">Total Profit</th>
                      <th className="py-2 px-4 border">Profit Margin (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedProfitDetails.map(detail => (
                      <tr key={detail.productName}>
                        <td className="py-2 px-4 border">{detail.productName}</td>
                        <td className="py-2 px-4 border">Rs. {detail.sellingPrice.toFixed(2)}</td>
                        <td className="py-2 px-4 border">{detail.quantitySold}</td>
                        <td className="py-2 px-4 border">Rs. {detail.totalRevenue.toFixed(2)}</td>
                        <td className="py-2 px-4 border">Rs. {detail.totalProfit.toFixed(2)}</td>
                        <td className="py-2 px-4 border">{detail.profitMargin.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : detailedProfitDetails ? (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-xl font-bold mb-2">
                Detailed Profit for {detailedProfitDetails.productName}
              </h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Selling Price</th>
                    <th className="py-2 px-4 border">Cost Price Override</th>
                    <th className="py-2 px-4 border">Quantity Sold</th>
                    <th className="py-2 px-4 border">Total Revenue</th>
                    <th className="py-2 px-4 border">Total Profit</th>
                    <th className="py-2 px-4 border">Profit Margin (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border">Rs. {detailedProfitDetails.sellingPrice.toFixed(2)}</td>
                    <td className="py-2 px-4 border">Rs. {detailedProfitDetails.costPrice.toFixed(2)}</td>
                    <td className="py-2 px-4 border">{detailedProfitDetails.quantitySold}</td>
                    <td className="py-2 px-4 border">Rs. {detailedProfitDetails.totalRevenue.toFixed(2)}</td>
                    <td className="py-2 px-4 border">Rs. {detailedProfitDetails.totalProfit.toFixed(2)}</td>
                    <td className="py-2 px-4 border">{detailedProfitDetails.profitMargin.toFixed(2)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

