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
} from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import ProductCard from "../../components/product/ProductCard";
import ImprovedImage from "@/components/ui/ImprovedImage";

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
  const { items, updateQuantity, removeItem, getSubtotal, decrementItem } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<
    (typeof availableCoupons)[0] | null
  >(null);
  const [couponError, setCouponError] = useState("");

  // Calculate cart totals
  const subtotal = getSubtotal();
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

  return (
    <div className="bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">Shopping Cart</h1>
      </div>

      {items.length > 0 ? (
        <>
          {/* Cart Items */}
          <div className="snap-container py-4 pb-32">
            <div className="bg-white rounded-lg p-4 mb-3">
              <h2 className="snap-heading-2 mb-3">
                Your Cart ({items.length})
              </h2>

              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                      {item.imageUrl && (
                        <ImprovedImage
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="snap-text font-medium">
                            <Link
                              href={`/products/${item.productId}`}
                              className="hover:text-indigo-600"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="font-semibold text-sm">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>

                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                          <button
                            className="px-2 py-1 text-indigo-600"
                            onClick={() => decrementItem(item.productId)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="text-sm font-medium px-2">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 text-indigo-600"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxQuantity}
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-lg p-4 mb-3">
              <div className="flex items-center mb-2">
                <FiTag className="text-indigo-600 mr-2" />
                <h3 className="snap-heading-3">Apply Coupon</h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <FiCheck className="text-green-600" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appliedCoupon.discount}% off up to ₹
                        {appliedCoupon.maxDiscount}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-indigo-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-indigo-300"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1">{couponError}</p>
                  )}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Available Coupons:
                    </p>
                    <div className="space-y-2">
                      {availableCoupons.map((coupon) => (
                        <div
                          key={coupon.code}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">{coupon.code}</p>
                            <p className="text-xs text-gray-500">
                              {coupon.discount}% off on min. order of ₹
                              {coupon.minOrder}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setCouponCode(coupon.code);
                              applyCoupon();
                            }}
                            className="text-xs text-indigo-600 font-medium"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-lg p-4 mb-3">
              <h3 className="snap-heading-3 mb-3">Bill Details</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Item Total</p>
                  <p className="font-medium">₹{subtotal.toFixed(2)}</p>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Coupon Discount</p>
                    <p className="font-medium text-green-600">
                      -₹{couponDiscount.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <p className="text-gray-600">GST</p>
                    <div className="relative group ml-1">
                      <FiInfo size={14} className="text-gray-400" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        5% GST applied on the item total
                      </div>
                    </div>
                  </div>
                  <p className="font-medium">₹{gstAmount.toFixed(2)}</p>
                </div>

                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Delivery Fee</p>
                  <p className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </p>
                </div>

                {deliveryFee > 0 && (
                  <p className="text-xs text-green-600">
                    Free delivery on orders above ₹499
                  </p>
                )}

                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                  <p className="snap-heading-3">Total Amount</p>
                  <p className="snap-heading-3 text-indigo-600">
                    ₹{total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Checkout Button */}
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg border-t border-gray-200 max-w-md mx-auto right-0 z-20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-semibold text-lg">₹{total.toFixed(2)}</p>
              </div>
              <Link
                href="/checkout"
                className="bg-indigo-600 text-white font-medium px-8 py-3 rounded-lg whitespace-nowrap hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      ) : (
        // Empty Cart
        <div className="flex flex-col items-center justify-center h-[calc(100vh-144px)] px-4 bg-white">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="snap-heading-1 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 text-center">
            Time to fill it with groceries and everyday essentials!
          </p>
          <Link
            href="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
