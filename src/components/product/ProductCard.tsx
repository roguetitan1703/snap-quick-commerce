"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiShoppingBag, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "@/hooks/useCart";
import ImprovedImage from "@/components/ui/ImprovedImage";

// This now matches the backend API schema
interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  currentStock: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductCardProps {
  product: Product;
  hideActions?: boolean;
  isWishlist?: boolean;
  onRemoveFromWishlist?: (id: number) => void;
}

export default function ProductCard({
  product,
  hideActions = false,
  isWishlist = false,
  onRemoveFromWishlist,
}: ProductCardProps) {
  // Add null check for product
  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        Product data not available
      </div>
    );
  }

  const {
    productId,
    name,
    category,
    price,
    imageUrl,
    currentStock = 0,
  } = product;

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Use the cart hook
  const { addToCart, updateCartItem, cartItems } = useCart();

  // Check if product is already in cart
  const isInCart = cartItems.some(
    (item) => item.product.productId === productId
  );

  const isOutOfStock = currentStock === 0;

  // Check if this product is already in the cart
  const cartItem = cartItems.find(
    (item) => item.product.productId === productId
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAddingToCart(true);
      await addToCart(productId, product, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDecrementQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = cartItems.find(
      (item) => item.product.productId === productId
    );

    if (cartItem) {
      try {
        await updateCartItem(
          cartItem.itemId,
          Math.max(1, cartItem.quantity - 1)
        );
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Product Image */}
      <Link href={`/products/${productId}`}>
        <div className="relative h-48 overflow-hidden">
          <ImprovedImage
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
            width={500}
            height={500}
            fallbackStyles="bg-gray-200 flex items-center justify-center text-gray-400 text-xl"
            fallbackContent={<FiShoppingBag size={32} />}
          />

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}

          {/* Low stock indicator */}
          {!isOutOfStock && currentStock && currentStock <= 5 && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Only {currentStock} left
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3">
        <div className="mb-2">
          <span className="text-gray-500 text-xs">{category}</span>
          <h3 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2">
            <Link href={`/products/${productId}`}>{name}</Link>
          </h3>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <span className="text-indigo-600 font-semibold">
                ₹{price.toFixed(2)}
              </span>
            </div>
          </div>

          {!hideActions && (
            <div className="flex items-center">
              {quantityInCart > 0 ? (
                <>
                  <button
                    className="px-2 py-1 text-indigo-600"
                    onClick={handleDecrementQuantity}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="mx-1 text-sm w-5 text-center">
                    {quantityInCart}
                  </span>
                </>
              ) : null}
              <button
                className="px-2 py-1 text-indigo-600"
                onClick={handleAddToCart}
                disabled={isOutOfStock || quantityInCart >= currentStock}
                aria-label="Increase quantity"
              >
                <FiPlus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
