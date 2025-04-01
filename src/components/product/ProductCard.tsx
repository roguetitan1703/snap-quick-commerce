"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiPlus, FiMinus } from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import { v4 as uuidv4 } from "uuid";
import ImprovedImage from "@/components/ui/ImprovedImage";



interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isNew?: boolean;
  discount?: number;
  currentStock?: number;
  className?: string;
}

// Product image component with error handling
const ProductImage = ({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name: string;
}) => {
  return (
    <div className="w-full h-36 bg-gray-100 relative">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholder-product.svg";
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-gray-100">
          <Image
            src="/images/placeholder-product.svg"
            alt={name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
    </div>
  );
};

const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  category,
  isNew = false,
  discount = 0,
  currentStock = 10,
  className = "",
}: ProductCardProps) => {
  const { addItem, items } = useCartStore((state) => ({
    addItem: state.addItem,
    items: state.items,
  }));
  const isOutOfStock = currentStock === 0;
  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  // Check if this product is already in the cart
  const cartItem = items.find((item) => item.productId === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentStock > 0) {
      addItem({
        id: cartItem?.id || uuidv4(),
        productId: id,
        name,
        price: discountedPrice,
        imageUrl: imageUrl || "",
        quantity: 1,
        maxQuantity: currentStock,
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      {/* Product Image */}
      <Link href={`/products/${id}`} className="block relative">
        <Suspense
          fallback={<div className="w-full h-36 bg-gray-200 animate-pulse" />}
        >
          <ProductImage imageUrl={imageUrl} name={name} />
        </Suspense>

        {/* Badge for new items or discount */}
        {isNew && !discount && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
            NEW
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            -{discount}%
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium text-sm">Out of Stock</span>
          </div>
        )}

        {/* Low stock indicator */}
        {!isOutOfStock && currentStock && currentStock <= 5 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
            Only {currentStock} left
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-3">
        {category && <p className="text-xs text-gray-500 mb-1">{category}</p>}

        <Link href={`/products/${id}`} className="block">
          <h3 className="font-medium text-sm line-clamp-2 h-10 mb-1">{name}</h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline">
            <span className="font-semibold text-sm text-gray-900">
              ₹{discountedPrice.toFixed(2)}
            </span>

            {discount > 0 && (
              <span className="ml-2 text-xs line-through text-gray-500">
                ₹{price.toFixed(2)}
              </span>
            )}
          </div>

          {quantityInCart > 0 ? (
            <div className="flex items-center bg-indigo-50 rounded-lg overflow-hidden">
              <button
                className="px-2 py-1 text-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  useCartStore.getState().decrementItem(id);
                }}
                aria-label="Decrease quantity"
              >
                <FiMinus size={14} />
              </button>
              <span className="text-sm font-medium text-indigo-800 px-2">
                {quantityInCart}
              </span>
              <button
                className="px-2 py-1 text-indigo-600"
                onClick={handleAddToCart}
                disabled={isOutOfStock || quantityInCart >= currentStock}
                aria-label="Increase quantity"
              >
                <FiPlus size={14} />
              </button>
            </div>
          ) : (
            <button
              className={`p-2 rounded-full ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400"
                  : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              }`}
              disabled={isOutOfStock}
              aria-label="Add to cart"
              onClick={handleAddToCart}
            >
              <FiPlus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
