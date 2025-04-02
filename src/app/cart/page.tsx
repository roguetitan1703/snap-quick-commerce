"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
  FiChevronLeft,
  FiTag,
  FiCheck,
  FiInfo,
  FiArrowLeft,
} from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import ImprovedImage from "@/components/ui/ImprovedImage";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/contexts/AuthContext";

// Sample recommended quick commerce grocery products
const recommendedProducts = [
  {
    id: "5",
    name: "Avocado (2 pcs)",
    price: 3.59,
    imageUrl:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fruits & Vegetables",
    currentStock: 30,
  },
  {
    id: "6",
    name: "Greek Yogurt",
    price: 4.49,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Dairy & Eggs",
    discount: 15,
    currentStock: 18,
  },
];

// Available coupons
const availableCoupons = [
  { code: "FIRST10", discount: 10, minOrder: 299, maxDiscount: 50 },
  { code: "WELCOME20", discount: 20, minOrder: 499, maxDiscount: 100 },
];

const CartPage = () => {
  const { cartItems, cartTotal, updateCartItem, removeCartItem, loading } =
    useCart();
  const { isAuthenticated } = useAuthContext();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<
    (typeof availableCoupons)[0] | null
  >(null);
  const [couponError, setCouponError] = useState("");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          actionButton={
            <Link
              href="/products"
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg"
            >
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  // Calculate cart totals
  const subtotal = cartTotal.totalAmount;
  const gstRate = 0.05; // 5% GST
  const gstAmount = subtotal * gstRate;

  // Delivery fee calculation - free for orders above ₹499
  const deliveryFee = subtotal >= 499 ? 0 : 39;

  // Calculate coupon discount
  const couponDiscount = appliedCoupon
    ? Math.min(
        (subtotal * appliedCoupon.discount) / 100,
        appliedCoupon.maxDiscount
      )
    : 0;

  // Calculate final total
  const total = subtotal + gstAmount + deliveryFee - couponDiscount;

  const applyCoupon = () => {
    // Reset error
    setCouponError("");

    // Check if coupon exists
    const coupon = availableCoupons.find((c) => c.code === couponCode);

    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }

    // Check minimum order amount
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order amount of ₹${coupon.minOrder} required`);
      return;
    }

    // Apply coupon
    setAppliedCoupon(coupon);
    setCouponCode("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (itemId: number | string) => {
    const item = cartItems.find((item) => item.itemId === itemId);
    if (item) {
      updateCartItem(itemId, item.quantity + 1);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (itemId: number | string) => {
    const item = cartItems.find((item) => item.itemId === itemId);
    if (item && item.quantity > 1) {
      updateCartItem(itemId, item.quantity - 1);
    } else {
      removeCartItem(itemId);
    }
  };

  // Handle item removal
  const handleRemoveItem = (itemId: number | string) => {
    removeCartItem(itemId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-indigo-600 mr-4">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item.itemId}
              className="flex items-center p-4 mb-4 bg-white rounded-lg shadow-sm"
            >
              <div className="w-20 h-20 relative flex-shrink-0">
                <ImprovedImage
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="rounded-md object-cover"
                  width={80}
                  height={80}
                />
              </div>

              <div className="ml-4 flex-grow">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {item.product.category}
                </p>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDecreaseQuantity(item.itemId)}
                    className="p-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="mx-3 min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.itemId)}
                    className="p-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.itemId)}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center"
                >
                  <FiTrash2 size={14} className="mr-1" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({cartTotal.totalItems} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                ₹{deliveryFee === 0 ? "Free" : deliveryFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-sm">
              <p className="text-gray-600">Coupon Discount</p>
              <p className="font-medium text-green-600">
                -₹{couponDiscount.toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <Link
            href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium text-center block hover:bg-indigo-700 transition"
          >
            {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
