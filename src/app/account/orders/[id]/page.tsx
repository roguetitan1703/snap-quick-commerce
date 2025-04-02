"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronLeft,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCheck,
  FiCreditCard,
  FiDownload,
  FiMessageSquare,
  FiShoppingBag,
} from "react-icons/fi";
import ImprovedImage from "@/components/ui/ImprovedImage";

// Helper function to get order by ID (mocked data for quick commerce grocery products)
const getOrderById = (id: string) => {
  // This would be replaced with an API call in production
  const orders = [
    {
      id: "ORD-1234",
      date: "Apr 2, 2023",
      total: 124.99,
      subtotal: 119.99,
      tax: 5.0,
      shipping: 0.0,
      status: "Delivered",
      deliveryAddress: "123 Main St, Apt 4B, Mumbai, MH 400001",
      trackingNumber: "TRK24680135",
      paymentMethod: "Credit Card (**** 4242)",
      items: [
        {
          id: 1,
          name: "Organic Bananas (6 pcs)",
          price: 4.99,
          quantity: 2,
          image: "/images/products/banana.jpg",
        },
        {
          id: 2,
          name: "Fresh Milk 1L",
          price: 2.99,
          quantity: 1,
          image: "/images/products/milk.jpg",
        },
        {
          id: 3,
          name: "Avocado (2 pcs)",
          price: 3.59,
          quantity: 2,
          image: "/images/products/avocado.jpg",
        },
      ],
      timeline: [
        {
          status: "Order Placed",
          date: "Apr 2, 2023",
          time: "09:45 AM",
          completed: true,
          icon: FiShoppingBag,
        },
        {
          status: "Order Confirmed",
          date: "Apr 2, 2023",
          time: "09:47 AM",
          completed: true,
          icon: FiCheck,
        },
        {
          status: "Out for Delivery",
          date: "Apr 2, 2023",
          time: "09:55 AM",
          completed: true,
          icon: FiTruck,
        },
        {
          status: "Delivered",
          date: "Apr 2, 2023",
          time: "10:12 AM",
          completed: true,
          icon: FiPackage,
        },
      ],
    },
    {
      id: "ORD-1189",
      date: "Mar 28, 2023",
      total: 64.5,
      subtotal: 59.5,
      tax: 5.0,
      shipping: 0.0,
      status: "Delivered",
      deliveryAddress: "456 Park Avenue, 2nd Floor, Mumbai, MH 400002",
      trackingNumber: "TRK87654321",
      paymentMethod: "UPI (user@bankname)",
      items: [
        {
          id: 4,
          name: "Brown Eggs (6 pcs)",
          price: 3.49,
          quantity: 1,
          image: "/images/products/eggs.jpg",
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
          image: "/images/products/yogurt.jpg",
        },
      ],
      timeline: [
        {
          status: "Order Placed",
          date: "Mar 28, 2023",
          time: "03:22 PM",
          completed: true,
          icon: FiShoppingBag,
        },
        {
          status: "Order Confirmed",
          date: "Mar 28, 2023",
          time: "03:25 PM",
          completed: true,
          icon: FiCheck,
        },
        {
          status: "Out for Delivery",
          date: "Mar 28, 2023",
          time: "03:35 PM",
          completed: true,
          icon: FiTruck,
        },
        {
          status: "Delivered",
          date: "Mar 28, 2023",
          time: "03:50 PM",
          completed: true,
          icon: FiPackage,
        },
      ],
    },
    {
      id: "ORD-1005",
      date: "Mar 15, 2023",
      total: 47.95,
      subtotal: 42.95,
      tax: 5.0,
      shipping: 0.0,
      status: "Delivered",
      deliveryAddress: "789 Ridge Road, Flat 3C, Mumbai, MH 400003",
      trackingNumber: "TRK12345678",
      paymentMethod: "Cash on Delivery",
      items: [
        {
          id: 7,
          name: "Almond Milk 1L",
          price: 3.99,
          quantity: 2,
          image: "/images/products/almond-milk.svg",
        },
        {
          id: 8,
          name: "Organic Spinach 250g",
          price: 2.49,
          quantity: 1,
          image: "/images/products/spinach.jpg",
        },
        {
          id: 9,
          name: "Mixed Berries Pack",
          price: 8.99,
          quantity: 2,
          image: "/images/products/berries.svg",
        },
        {
          id: 10,
          name: "Toilet Paper 6 Rolls",
          price: 5.99,
          quantity: 1,
          image: "/images/products/toilet-paper.svg",
        },
        {
          id: 11,
          name: "Liquid Hand Soap 250ml",
          price: 3.79,
          quantity: 1,
          image: "/images/products/soap.svg",
        },
      ],
      timeline: [
        {
          status: "Order Placed",
          date: "Mar 15, 2023",
          time: "11:15 AM",
          completed: true,
          icon: FiShoppingBag,
        },
        {
          status: "Order Confirmed",
          date: "Mar 15, 2023",
          time: "11:18 AM",
          completed: true,
          icon: FiCheck,
        },
        {
          status: "Out for Delivery",
          date: "Mar 15, 2023",
          time: "11:30 AM",
          completed: true,
          icon: FiTruck,
        },
        {
          status: "Delivered",
          date: "Mar 15, 2023",
          time: "11:55 AM",
          completed: true,
          icon: FiPackage,
        },
      ],
    },
  ];

  return orders.find((order) => order.id === id);
};

// Item image component with error handling
const ItemImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="80px"
        onError={(e) => {
          console.error(`Failed to load image: ${src}`);
          const target = e.target as HTMLImageElement;
          target.src = "/images/placeholder-product.svg";
        }}
      />
    </div>
  );
};

// Component for the status timeline
interface TimelineItem {
  status: string;
  date: string;
  time: string;
  completed: boolean;
  icon: React.ElementType;
}

const Timeline = ({ items }: { items: TimelineItem[] }) => {
  return (
    <div className="pt-2">
      <h3 className="text-base font-medium mb-4">Order Timeline</h3>
      <div className="relative pl-8 pb-2">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline items */}
        {items.map((item, index) => (
          <div key={index} className="mb-5 relative">
            {/* Status icon */}
            <div
              className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center ${
                item.completed ? "bg-indigo-100" : "bg-gray-100"
              }`}
            >
              <item.icon
                className={`w-3 h-3 ${
                  item.completed ? "text-indigo-600" : "text-gray-400"
                }`}
              />
            </div>

            {/* Status content */}
            <div>
              <h4 className="font-medium text-gray-900">{item.status}</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.date} • {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = getOrderById(params.id);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
          <Link href="/account/orders" className="mr-3">
            <FiChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Order Details</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiPackage className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Sorry, we couldn't find the order you're looking for.
          </p>
          <Link
            href="/account/orders"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account/orders" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Order Details</h1>
      </div>

      {/* Order summary */}
      <div className="bg-white p-4 mb-3">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-semibold text-gray-900 mb-0.5">{order.id}</h2>
            <p className="text-sm text-gray-500">Placed on {order.date}</p>
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

        {/* Tracking information */}
        {order.trackingNumber && (
          <div className="p-3 bg-indigo-50 rounded-lg mb-2 flex items-center">
            <FiTruck className="text-indigo-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Order #{order.trackingNumber}
              </p>
              <p className="text-xs text-gray-500">
                {order.status === "Delivered"
                  ? "Delivered on"
                  : "Expected delivery"}{" "}
                {order.date}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="bg-white p-4 mb-3">
        <h3 className="text-base font-medium mb-3">
          Items ({order.items.length})
        </h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex">
              <Suspense
                fallback={
                  <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg flex-shrink-0"></div>
                }
              >
                <ItemImage src={item.image} alt={item.name} />
              </Suspense>
              <div className="ml-3 flex-1">
                <h4 className="font-medium text-gray-900 text-sm">
                  {item.name}
                </h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="font-semibold text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{item.price.toFixed(2)} each
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order timeline */}
      <div className="bg-white p-4 mb-3">
        <Timeline items={order.timeline} />
      </div>

      {/* Delivery information */}
      <div className="bg-white p-4 mb-3">
        <div className="flex items-center mb-3">
          <FiMapPin className="text-indigo-600 mr-2" />
          <h3 className="text-base font-medium">Delivery Address</h3>
        </div>
        <p className="text-sm text-gray-700 ml-6">{order.deliveryAddress}</p>
      </div>

      {/* Payment information */}
      <div className="bg-white p-4 mb-3">
        <div className="flex items-center mb-3">
          <FiCreditCard className="text-indigo-600 mr-2" />
          <h3 className="text-base font-medium">Payment Information</h3>
        </div>

        <div className="ml-6 mb-3">
          <p className="text-xs text-gray-500">Payment Method</p>
          <p className="text-sm font-medium">{order.paymentMethod}</p>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <p className="text-gray-500">Subtotal</p>
            <p className="font-medium">₹{order.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-500">Shipping</p>
            <p className="font-medium">
              {order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-500">Tax</p>
            <p className="font-medium">₹{order.tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-gray-100 mt-2">
            <p className="font-bold">Total</p>
            <p className="font-bold text-indigo-600">
              ₹{order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex space-x-3">
        <Link
          href="#"
          className="flex-1 flex items-center justify-center py-3 bg-white text-indigo-600 border border-indigo-200 font-medium rounded-lg shadow-sm text-sm"
        >
          <FiMessageSquare className="mr-2" />
          Need Help?
        </Link>
        <Link
          href="#"
          className="flex-1 flex items-center justify-center py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm text-sm"
        >
          <FiDownload className="mr-2" />
          Download Invoice
        </Link>
      </div>
    </div>
  );
}
