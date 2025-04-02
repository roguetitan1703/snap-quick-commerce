"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiBox,
  FiClock,
  FiShield,
  FiMinus,
  FiPlus,
  FiTruck,
} from "react-icons/fi";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/contexts/AuthContext";
import ImprovedImage from "@/components/ui/ImprovedImage";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { product, loading, error } = useProduct(productId);
  const { addToCart, loading: cartLoading, error: cartError } = useCart();
  const { isAuthenticated } = useAuthContext();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Handle invalid product ID
  useEffect(() => {
    if (!loading && !product && !error) {
      router.replace("/products");
    }
  }, [loading, product, error, router]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(productId, quantity);
      // Show a success message or redirect to cart
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => router.back()} className="mr-3">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="snap-heading-1">Product Details</h1>
        </div>
        <div className="p-4 flex-1 flex flex-col items-center justify-center">
          <div className="snap-loading-spinner"></div>
          <p className="mt-4 snap-text-secondary">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => router.back()} className="mr-3">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="snap-heading-1">Product Details</h1>
        </div>
        <div className="p-4 flex-1 flex flex-col items-center justify-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="snap-heading-1">Product Details</h1>
        <div className="ml-auto flex space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <FiHeart className="w-5 h-5" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => router.push("/cart")}
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative">
          <ImprovedImage
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
            className="p-4"
            productName={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="p-4">
          <div className="mb-4">
            <h2 className="snap-heading-1 mb-1">{product.name}</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-amber-400">
                <FiStar className="w-4 h-4 fill-current" />
                <FiStar className="w-4 h-4 fill-current" />
                <FiStar className="w-4 h-4 fill-current" />
                <FiStar className="w-4 h-4 fill-current" />
                <FiStar className="w-4 h-4" />
              </div>
              <span className="snap-text-secondary text-sm">(120 reviews)</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline mb-2">
              <span className="snap-heading-1 text-xl mr-2">
                ${product.price.toFixed(2)}
              </span>
              {product.currentStock > 0 ? (
                <span className="text-sm text-green-600">In Stock</span>
              ) : (
                <span className="text-sm text-red-600">Out of Stock</span>
              )}
            </div>
            <p className="snap-text">{product.description}</p>
          </div>

          {/* Product Features */}
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <h3 className="snap-heading-2 mb-3">Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <FiBox className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="snap-text-sm">
                  Category: {product.category}
                </span>
              </div>
              <div className="flex items-center">
                <FiTruck className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="snap-text-sm">Free delivery</span>
              </div>
              <div className="flex items-center">
                <FiClock className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="snap-text-sm">Same-day delivery</span>
              </div>
              <div className="flex items-center">
                <FiShield className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="snap-text-sm">30-day warranty</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="snap-heading-2 mb-3">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  quantity <= 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="snap-text mx-4 w-6 text-center">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {cartError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {cartError}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex space-x-3">
        <button
          onClick={handleAddToCart}
          disabled={cartLoading || isAddingToCart || product.currentStock <= 0}
          className="snap-button-primary flex-1 py-3 rounded-lg"
        >
          {isAddingToCart || cartLoading
            ? "Adding..."
            : product.currentStock <= 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
