"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiCreditCard,
  FiMapPin,
  FiTruck,
  FiCheck,
  FiChevronRight,
  FiShoppingBag,
  FiChevronLeft,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/contexts/AuthContext";

// Payment method options
const paymentMethods = [
  { id: "upi", name: "UPI", icon: FiCreditCard },
  { id: "credit-card", name: "Credit/Debit Card", icon: FiCreditCard },
  { id: "cash", name: "Cash on Delivery", icon: FiCreditCard },
];

// Delivery slots
const deliverySlots = [
  {
    id: "express-10",
    label: "In 10 minutes",
    time: "Express Delivery",
    fee: 35,
  },
  {
    id: "express-20",
    label: "In 20 minutes",
    time: "Express Delivery",
    fee: 25,
  },
  {
    id: "slot-1",
    label: "1:00 PM - 2:00 PM",
    time: "Today",
    fee: 15,
  },
  {
    id: "slot-2",
    label: "2:00 PM - 3:00 PM",
    time: "Today",
    fee: 15,
  },
  {
    id: "slot-3",
    label: "3:00 PM - 4:00 PM",
    time: "Today",
    fee: 15,
  },
];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Don't render the page content if not authenticated
  if (!isAuthenticated) {
    return null; // The useEffect will redirect
  }

  // Calculate totals
  const subtotal = cartTotal.totalAmount;
  const deliveryFee =
    deliverySlots.find((slot) => slot.id === selectedSlot)?.fee || 0;
  const packagingFee = 5; // Fixed packaging fee
  const total = subtotal + deliveryFee + packagingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // This would normally be an API call to process the order
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Order successful
      setIsOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
          <Link href="/" className="mr-3">
            <FiChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="snap-heading-1">Order Confirmation</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="snap-heading-1 mb-2 text-center">
            Your order has been placed!
          </h2>
          <p className="snap-text-secondary mb-4 text-center">
            Order #SNP-{Math.floor(100000 + Math.random() * 900000)}
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg mb-8 w-full max-w-sm">
            <div className="flex items-center mb-2">
              <FiClock className="text-indigo-600 mr-2" />
              <p className="snap-text font-medium">
                Estimated delivery:{" "}
                {deliverySlots.find((slot) => slot.id === selectedSlot)?.label}
              </p>
            </div>
            <p className="snap-text-secondary text-sm">
              We'll notify you when your order is on the way!
            </p>
          </div>
          <Link
            href="/products"
            className="snap-button-primary py-3 px-6 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
          <Link href="/cart" className="mr-3">
            <FiChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="snap-heading-1">Checkout</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FiShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="snap-heading-1 mb-2">Your cart is empty</h2>
          <p className="snap-text-secondary mb-8 text-center">
            Add some items to your cart before checking out.
          </p>
          <Link
            href="/products"
            className="snap-button-primary py-3 px-6 rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/cart" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">Checkout</h1>
      </div>

      <div className="px-4 py-3 flex-1">
        <form onSubmit={handleSubmitOrder}>
          {/* Delivery Address Section */}
          <div className="snap-card mb-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="snap-heading-3">Delivery Address</h2>
              <Link
                href="/account/addresses"
                className="snap-text-secondary text-indigo-600 flex items-center text-sm"
              >
                Change <FiChevronRight className="ml-1" size={14} />
              </Link>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-full bg-indigo-100 mr-3 flex-shrink-0">
                <FiMapPin className="text-indigo-600" size={16} />
              </div>
              <div>
                <p className="snap-text font-medium">Home</p>
                <p className="snap-text-secondary text-sm">
                  123 Main Street, Apt 4B
                </p>
                <p className="snap-text-secondary text-sm">
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Slots */}
          <div className="snap-card mb-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="snap-heading-3">Delivery Time</h2>
              <button
                type="button"
                onClick={() => setShowDeliveryInfo(!showDeliveryInfo)}
                className="text-indigo-600"
              >
                <FiInfo size={16} />
              </button>
            </div>

            {showDeliveryInfo && (
              <div className="bg-indigo-50 p-3 rounded-lg mb-3 text-sm">
                <p className="snap-text">
                  Express delivery may be impacted by high demand or weather
                  conditions.
                </p>
              </div>
            )}

            <div className="space-y-2 mb-2">
              {deliverySlots.map((slot) => (
                <label
                  key={slot.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectedSlot === slot.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_slot"
                    value={slot.id}
                    checked={selectedSlot === slot.id}
                    onChange={() => setSelectedSlot(slot.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                        selectedSlot === slot.id
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedSlot === slot.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                      )}
                    </span>
                  </div>

                  <div className="ml-3 flex-1 flex justify-between">
                    <div>
                      <p className="snap-text font-medium">{slot.label}</p>
                      <p className="snap-text-secondary text-xs">{slot.time}</p>
                    </div>
                    <p className="snap-text font-medium">₹{slot.fee}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="snap-card mb-3">
            <h2 className="snap-heading-3 mb-3">Payment Method</h2>

            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectedPayment === method.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                        selectedPayment === method.id
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPayment === method.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                      )}
                    </span>
                  </div>

                  <div className="ml-3 flex-1">
                    <p className="snap-text font-medium">{method.name}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Bill Details */}
          <div className="snap-card mb-20">
            <h2 className="snap-heading-3 mb-3">Bill Details</h2>

            <div className="border-t border-dashed border-gray-200 pt-3 space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Packaging Fee</span>
                <span>₹{packagingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Order Summary</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center py-2 border-b border-gray-100"
                  >
                    <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ₹{item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ₹{(item.quantity * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Payment Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg border-t border-gray-200 max-w-md mx-auto right-0 z-20">
        <div className="flex justify-between items-center mb-2">
          <p className="snap-text font-medium">Total</p>
          <p className="snap-heading-2 text-indigo-600">₹{total.toFixed(2)}</p>
        </div>
        <button
          type="button"
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="snap-button-primary w-full py-3 rounded-lg whitespace-nowrap"
        >
          {isSubmitting ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
