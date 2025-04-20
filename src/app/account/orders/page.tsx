"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronRight,
  FiChevronLeft,
  FiPackage,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
import ImprovedImage from "@/components/ui/ImprovedImage";
import api from "@/utils/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { formatPrice } from "@/utils/formatters";

// Define interfaces for type safety
interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

// Image component with error handling and fallback
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="flex-none w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="64px"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/placeholder-product.svg"; // Fallback to placeholder image
        }}
      />
    </div>
  );
};

const OrdersPage = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/orders");

        // If the API returns real orders, use them
        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          // If the API doesn't return orders yet, fall back to example data
          // but use the SVG images instead of JPGs
          setOrders([
            {
              id: "ORD-1234",
              date: "Apr 2, 2023",
              total: 124.99,
              status: "Delivered",
              items: [
                {
                  id: 1,
                  name: "Organic Bananas (6 pcs)",
                  price: 4.99,
                  quantity: 2,
                  image: "/images/products/bananas.svg",
                },
                {
                  id: 2,
                  name: "Fresh Milk 1L",
                  price: 2.99,
                  quantity: 1,
                  image: "/images/products/milk.svg",
                },
                {
                  id: 3,
                  name: "Avocado (2 pcs)",
                  price: 3.59,
                  quantity: 2,
                  image: "/images/products/avocado.svg",
                },
              ],
            },
            {
              id: "ORD-1189",
              date: "Mar 28, 2023",
              total: 64.5,
              status: "Delivered",
              items: [
                {
                  id: 4,
                  name: "Brown Eggs (6 pcs)",
                  price: 3.49,
                  quantity: 1,
                  image: "/images/products/eggs.svg",
                },
                {
                  id: 5,
                  name: "Sourdough Bread",
                  price: 5.99,
                  quantity: 2,
                  image: "/images/products/bread.svg",
                },
                {
                  id: 6,
                  name: "Greek Yogurt",
                  price: 4.49,
                  quantity: 3,
                  image: "/images/products/yogurt.svg",
                },
              ],
            },
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FiLoader className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="p-4 space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm text-gray-500">{order.date}</span>
                    <h3 className="font-medium text-gray-900">{order.id}</h3>
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center mb-3 overflow-x-auto hide-scrollbar space-x-2">
                  <Suspense
                    fallback={
                      <div className="flex space-x-2">
                        {[...Array(Math.min(3, order.items.length))].map(
                          (_, i) => (
                            <div
                              key={i}
                              className="flex-none w-16 h-16 bg-gray-200 rounded-lg animate-pulse"
                            ></div>
                          )
                        )}
                      </div>
                    }
                  >
                    {order.items.slice(0, 3).map((item) => (
                      <ProductImage
                        key={item.id}
                        src={item.image}
                        alt={item.name}
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex-none w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-700">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </Suspense>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500">Total</span>
                    <p className="font-bold text-gray-900">
                      ₹{formatPrice(order.total)}
                    </p>
                  </div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center text-indigo-600 font-medium text-sm"
                  >
                    <span>Order Details</span>
                    <FiChevronRight className="ml-1" size={16} />
                  </Link>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 flex items-center text-sm">
                <FiPackage className="text-indigo-600 mr-2" />
                <span>
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"} -{" "}
                  {order.status === "Delivered"
                    ? "Delivered on"
                    : "Expected delivery"}{" "}
                  {order.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiArrowLeft className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Looks like you haven't made any orders yet. Start shopping to create
            your first order.
          </p>
          <Link
            href="/products"
            className="bg-indigo-600 text-white py-2 px-6 rounded-full font-medium"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
