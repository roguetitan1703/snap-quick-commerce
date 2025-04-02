"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiSearch,
  FiClock,
  FiTruck,
  FiTag,
  FiArrowRight,
  FiMapPin,
  FiShoppingBag,
  FiPercent,
} from "react-icons/fi";
import ProductCard from "../components/product/ProductCard";
import ImprovedImage from "@/components/ui/ImprovedImage";
import { useProducts, Product } from "@/hooks/useProducts";

// Quick commerce categories - groceries focus
const categories = [
  {
    id: "fruits-veg",
    name: "Fruits & Vegetables",
    imageUrl: "/images/categories/fruits-vegetables.jpg",
    color: "bg-green-100",
    icon: "🥕",
  },
  {
    id: "dairy",
    name: "Dairy & Eggs",
    imageUrl: "/images/categories/dairy-eggs.jpg",
    color: "bg-blue-100",
    icon: "🥛",
  },
  {
    id: "snacks",
    name: "Snacks",
    imageUrl: "/images/categories/snacks.jpg",
    color: "bg-yellow-100",
    icon: "🍿",
  },
  {
    id: "beverages",
    name: "Beverages",
    imageUrl: "/images/categories/beverages.jpg",
    color: "bg-red-100",
    icon: "🥤",
  },
  {
    id: "bakery",
    name: "Bakery",
    imageUrl: "/images/categories/bakery.jpg",
    color: "bg-amber-100",
    icon: "🍞",
  },
  {
    id: "personal-care",
    name: "Personal Care",
    imageUrl: "/images/categories/personal-care.jpg",
    color: "bg-purple-100",
    icon: "🧴",
  },
  {
    id: "home-cleaning",
    name: "Home & Cleaning",
    imageUrl: "/images/categories/cleaning.jpg",
    color: "bg-cyan-100",
    icon: "🧹",
  },
  {
    id: "baby-care",
    name: "Baby Care",
    imageUrl: "/images/categories/baby-care.jpg",
    color: "bg-pink-100",
    icon: "🍼",
  },
];

export default function Home() {
  // Fetch products from API instead of using hardcoded data
  const { products, loading, error } = useProducts();

  // State for different product sections
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleItems, setSaleItems] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);

  // Filter products for different sections once data is loaded
  useEffect(() => {
    if (products.length > 0) {
      // Get 4 random products for featured section
      const featuredItems = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      // Get 2 products for sale items
      const onSale = [...products]
        .filter(
          (p) =>
            p.category === "Fruits & Vegetables" ||
            p.category === "Dairy & Eggs"
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((p) => ({ ...p, discount: 25 }));

      // Get 2 different products for deals
      const dailyDeals = [...products]
        .filter((p) => !onSale.find((s) => s.productId === p.productId))
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((p) => ({ ...p, discount: 30 }));

      setFeaturedProducts(featuredItems);
      setSaleItems(onSale);
      setDeals(dailyDeals);
    }
  }, [products]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-600 mb-2">Oops!</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pb-20 bg-gray-50">
      {/* App Header */}
      <div className="bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-indigo-600">Snap Quick</h1>
            <div className="flex items-center text-xs text-gray-500">
              <FiMapPin className="mr-1" size={12} />
              <span>Deliver to: Home</span>
            </div>
          </div>
          <Link href="/account" className="p-2">
            <FiShoppingBag size={20} />
          </Link>
        </div>

        {/* Search Bar */}
        <Link href="/search" className="relative block">
          <div className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none text-gray-500 text-sm">
            Search for groceries, household items...
          </div>
          <div className="absolute top-0 left-0 h-full flex items-center pl-4">
            <FiSearch className="text-gray-500" />
          </div>
        </Link>
      </div>

      {/* Delivery Banner */}
      <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <FiClock className="mr-2" />
          <span className="text-sm font-medium">Delivery in 10 minutes</span>
        </div>
        <Link href="/products" className="text-xs underline">
          Learn more
        </Link>
      </div>

      {/* Banners Carousel */}
      <div className="px-4 py-3">
        <div className="h-32 rounded-lg overflow-hidden relative bg-gradient-to-r from-green-400 to-blue-500">
          <div className="absolute inset-0 flex flex-col justify-center p-4 text-white">
            <h2 className="text-lg font-bold mb-1">10% off on first order</h2>
            <p className="text-sm mb-2">Use code: SNAP10</p>
            <Link
              href="/products"
              className="bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="snap-heading-2">Shop by Category</h2>
          <Link
            href="/products"
            className="text-xs text-indigo-600 font-medium"
          >
            See All
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.name}`}
              className="flex flex-col items-center"
            >
              <div
                className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center mb-1`}
              >
                <span className="text-2xl">{category.icon}</span>
              </div>
              <span className="text-xs text-center line-clamp-2">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Deals of the Day */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <FiPercent className="text-red-500 mr-2" />
            <h2 className="snap-heading-2">Deals of the Day</h2>
          </div>
          <Link
            href="/products?sale=true"
            className="text-xs text-indigo-600 font-medium"
          >
            See All
          </Link>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar space-x-3 pb-2">
          {deals.map((product) => (
            <div key={product.productId} className="w-36 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-red-500 font-bold mr-2">⚡</span>
            <h2 className="snap-heading-2">Flash Sale</h2>
          </div>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
            Ends in 5:30:45
          </span>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar space-x-3 pb-2">
          {saleItems.map((product) => (
            <div key={product.productId} className="w-36 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="snap-heading-2">Popular Items</h2>
          <Link
            href="/products"
            className="text-xs text-indigo-600 font-medium"
          >
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>

      {/* Delivery Features */}
      <div className="px-4 py-5 bg-white mt-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-1">
              <FiClock className="text-green-600" size={18} />
            </div>
            <span className="text-xs text-center">10-Minute Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
              <FiTruck className="text-blue-600" size={18} />
            </div>
            <span className="text-xs text-center">Free Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-1">
              <FiTag className="text-amber-600" size={18} />
            </div>
            <span className="text-xs text-center">Best Prices</span>
          </div>
        </div>
      </div>

      {/* Refer & Earn */}
      <div className="px-4 py-3">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-1">Refer & Earn ₹100</h3>
          <p className="text-xs text-gray-600 mb-2">
            Share Snap Quick with friends & family
          </p>
          <Link
            href="/account/refer"
            className="bg-indigo-600 text-white text-sm py-2 px-4 rounded-lg inline-block font-medium"
          >
            Invite Friends
          </Link>
        </div>
      </div>
    </main>
  );
}
