"use client";

import React, { useState } from "react";
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
  FiCreditCard,
  FiShield,
} from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import ImprovedImage from "@/components/ui/ImprovedImage";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/contexts/AuthContext";

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

  // Calculate cart totals with safety checks
  const subtotal = cartTotal?.totalAmount || 0;
  const gstRate = 0.05; // 5% GST
  const gstAmount = subtotal * gstRate;
  const deliveryFee = subtotal >= 499 ? 0 : 39;
  const couponDiscount = appliedCoupon
    ? Math.min(
        (subtotal * appliedCoupon.discount) / 100,
        appliedCoupon.maxDiscount
      )
    : 0;
  const total = subtotal + gstAmount + deliveryFee - couponDiscount;

  // Functions to manage cart items
  const increaseQuantity = async (
    itemId: number | string,
    currentQty: number
  ) => {
    try {
      await updateCartItem(itemId, currentQty + 1);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const decreaseQuantity = async (
    itemId: number | string,
    currentQty: number
  ) => {
    if (currentQty <= 1) {
      await removeItem(itemId);
    } else {
      try {
        await updateCartItem(itemId, currentQty - 1);
      } catch (error) {
        console.error("Failed to decrease quantity:", error);
      }
    }
  };

  const removeItem = async (itemId: number | string) => {
    try {
      await removeCartItem(itemId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode);
    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(
        `Minimum order amount of ₹${coupon.minOrder} required for this coupon`
      );
      return;
    }
    setAppliedCoupon(coupon);
    setCouponError("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-4">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          actionButton={
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-sm"
            >
              <FiShoppingBag className="mr-2" size={16} />
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="grid grid-cols-1 gap-6">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.itemId}
              className="bg-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-shrink-0 w-32 h-32 mx-auto sm:mx-0 relative">
                <ImprovedImage
                  src={item.product?.imageUrl || "/placeholder-product.jpg"}
                  alt={item.product?.name || "Product image"}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-medium">
                  {item.product?.name || "Product"}
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-auto line-clamp-2">
                  {item.product?.description?.substring(0, 100) ||
                    "No description available"}
                  {item.product?.description &&
                  item.product.description.length > 100
                    ? "..."
                    : ""}
                </p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <div className="text-lg font-semibold">
                    ₹{(item.product?.price || 0).toFixed(2)}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.itemId, item.quantity)
                      }
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="mx-3 text-base font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        increaseQuantity(item.itemId, item.quantity)
                      }
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      aria-label="Increase quantity"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.itemId)}
                      className="ml-4 p-1 text-red-500 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Order Summary
          </h2>

          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (5%)</span>
              <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `₹${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Coupon Discount</span>
                <span className="font-medium">
                  -₹{couponDiscount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 mt-2.5">
              <div className="flex justify-between my-1">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              {subtotal < 499 && (
                <p className="mt-2 text-xs text-gray-600">
                  Add items worth ₹{(499 - subtotal).toFixed(2)} more for free
                  delivery
                </p>
              )}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <FiTag className="text-gray-400 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-900">
                Have a coupon?
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode || !!appliedCoupon}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="mt-2 text-xs text-red-600 flex items-center">
                <FiInfo className="mr-1 flex-shrink-0" size={12} />
                {couponError}
              </p>
            )}
            {appliedCoupon && (
              <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded-md">
                <div className="flex items-center">
                  <FiCheck
                    className="text-green-500 mr-1 flex-shrink-0"
                    size={12}
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {appliedCoupon.code} ({appliedCoupon.discount}% off)
                    </p>
                    <p className="text-xs text-gray-600">
                      You saved ₹{couponDiscount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:text-red-800 font-medium ml-2"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <div className="mt-5">
            <Link
              href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
              className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-sm"
            >
              {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
            </Link>

            {/* Trust Indicators */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
                  <FiShield className="text-gray-500 mb-1" size={16} />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
                  <FiCreditCard className="text-gray-500 mb-1" size={16} />
                  <span className="text-xs text-gray-600">
                    Multiple Payment Options
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
