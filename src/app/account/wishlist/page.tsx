"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronLeft,
  FiHeart,
  FiTrash2,
  FiShoppingBag,
  FiPlus,
} from "react-icons/fi";
import { useCartStore } from "../../../store/cartStore";
import { v4 as uuidv4 } from "uuid";
import ImprovedImage from "@/components/ui/ImprovedImage";



// Mock wishlist data for quick commerce grocery products
const wishlistItems = [
  {
    id: 1,
    name: "Organic Bananas (6 pcs)",
    price: 4.99,
    image: "/images/products/banana.jpg",
    category: "Fruits & Vegetables",
    currentStock: 50,
  },
  {
    id: 2,
    name: "Fresh Milk 1L",
    price: 2.99,
    image: "/images/products/milk.jpg",
    category: "Dairy & Eggs",
    currentStock: 35,
  },
  {
    id: 3,
    name: "Brown Eggs (6 pcs)",
    price: 3.49,
    image: "/images/products/eggs.jpg",
    category: "Dairy & Eggs",
    currentStock: 24,
  },
  {
    id: 4,
    name: "Avocado (2 pcs)",
    price: 3.59,
    image: "/images/products/avocado.jpg",
    category: "Fruits & Vegetables",
    currentStock: 30,
  },
];

// Image component with error handling and fallback
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="80px"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/placeholder-product.svg"; // Fallback to placeholder image
        }}
      />
    </div>
  );
};

const WishlistPage = () => {
  const [items, setItems] = useState(wishlistItems);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});
  const { addItem } = useCartStore();

  const removeFromWishlist = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addItem({
      id: uuidv4(),
      productId: String(item.id),
      name: item.name,
      price: item.price,
      imageUrl: item.image,
      quantity: 1,
      maxQuantity: item.currentStock || 10,
    });

    // Show added feedback
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">My Wishlist</h1>
      </div>

      {items.length > 0 ? (
        <div className="p-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Suspense
                  fallback={
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                  }
                >
                  <ProductImage src={item.image} alt={item.name} />
                </Suspense>

                <div className="ml-3 flex-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      {item.category}
                    </span>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="font-medium text-gray-900 mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex mt-3 space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={addedItems[item.id]}
                      className={`flex items-center justify-center px-3 py-1.5 rounded text-sm font-medium flex-1 ${
                        addedItems[item.id]
                          ? "bg-green-500 text-white"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      {addedItems[item.id] ? (
                        <>Added</>
                      ) : (
                        <>
                          <FiPlus className="mr-1" size={14} />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex items-center justify-center px-3 py-1.5 rounded border border-gray-300 text-sm text-gray-700"
                    >
                      <FiTrash2 size={14} className="mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiHeart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Browse our products and save your favorites for later
          </p>
          <Link
            href="/products"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium"
          >
            Discover Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
