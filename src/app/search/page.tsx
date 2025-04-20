"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImprovedImage from "@/components/ui/ImprovedImage";
import {
  FiSearch,
  FiX,
  FiClock,
  FiArrowRight,
  FiChevronLeft,
  FiFilter,
} from "react-icons/fi";

// Sample product data (will be replaced with API calls)
const allProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 129.99,
    imageUrl: "/images/products/headphones.svg",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    imageUrl: "/images/products/tshirt.svg",
    category: "Clothing",
  },
  {
    id: "3",
    name: "Smart Water Bottle",
    price: 39.99,
    imageUrl: "/images/products/water-bottle.svg",
    category: "Health",
  },
  {
    id: "4",
    name: "Gourmet Coffee Beans",
    price: 14.99,
    imageUrl: "/images/products/coffee.svg",
    category: "Food",
  },
];

// Sample search history
const initialSearchHistory = ["headphones", "water bottle", "t-shirt"];

// Sample categories for suggestions
const popularCategories = [
  {
    name: "Electronics",
    icon: "📱",
  },
  {
    name: "Clothing",
    icon: "👕",
  },
  {
    name: "Health",
    icon: "💊",
  },
  {
    name: "Food",
    icon: "🍔",
  },
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(initialSearchHistory);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Focus the search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Search products when search term changes
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/products?search=${searchTerm}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim() === "") return;

    // Add search term to history if it's not already there
    if (!searchHistory.includes(searchTerm.toLowerCase())) {
      setSearchHistory((prev) => [
        searchTerm.toLowerCase(),
        ...prev.slice(0, 4),
      ]);
    }

    // Navigate to products page with search term
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const removeFromHistory = (term: string) => {
    setSearchHistory((prev) => prev.filter((item) => item !== term));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold">Search Products</h1>
        <button
          className="ml-auto p-2 rounded-full bg-gray-100"
          aria-label="Filter products"
        >
          <FiFilter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex mb-4">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Search for products..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button className="px-4 bg-indigo-600 text-white rounded-r-md">
          <FiSearch />
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative h-40 overflow-hidden">
                  <ImprovedImage
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <span className="text-gray-500 text-xs">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-indigo-600 font-semibold">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No results found for "{searchTerm}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
