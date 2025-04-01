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
} from "react-icons/fi";

// Sample product data (will be replaced with API calls)
const allProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 129.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    imageUrl:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Clothing",
  },
  {
    id: "3",
    name: "Smart Water Bottle",
    price: 39.99,
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww",
    category: "Health",
  },
  {
    id: "4",
    name: "Gourmet Coffee Beans",
    price: 14.99,
    imageUrl:
      "https://images.unsplash.com/photo-1626778279070-c5577ca5fe27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvZmZlZSUyMGJlYW5zfGVufDB8fDB8fHww",
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

  // Focus the search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Search products when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
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
    <div className="pb-20">
      {/* Header with back button */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">Search</h1>
      </div>

      {/* Search Bar */}
      <div className="snap-container">
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          />
          <div className="absolute top-0 left-0 h-full flex items-center pl-4">
            <FiSearch className="text-gray-500" />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute top-0 right-0 h-full flex items-center pr-4"
              aria-label="Clear search"
            >
              <FiX className="text-gray-500" />
            </button>
          )}
        </form>
      </div>

      {/* Search Content */}
      <div className="snap-container">
        {searchTerm === "" ? (
          // Show history and suggestions when no search term
          <>
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="snap-section">
                <h3 className="snap-heading-3 mb-3">Recent Searches</h3>
                <ul className="space-y-3">
                  {searchHistory.map((term) => (
                    <li
                      key={term}
                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                    >
                      <button
                        className="flex items-center snap-text"
                        onClick={() => setSearchTerm(term)}
                      >
                        <FiClock className="text-gray-400 mr-3" />
                        <span>{term}</span>
                      </button>
                      <button
                        onClick={() => removeFromHistory(term)}
                        className="text-gray-400"
                        aria-label={`Remove ${term} from search history`}
                      >
                        <FiX size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Popular Categories */}
            <div className="snap-section">
              <h3 className="snap-heading-3 mb-3">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularCategories.map((category) => (
                  <Link
                    href={`/products?category=${category.name}`}
                    key={category.name}
                    className="flex items-center p-3 bg-white shadow-sm rounded-lg"
                  >
                    <span className="text-xl mr-3">{category.icon}</span>
                    <span className="snap-text">{category.name}</span>
                    <FiArrowRight className="ml-auto text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Show search results when search term exists
          <div className="snap-section">
            {searchResults.length > 0 ? (
              <>
                <p className="snap-text-secondary mb-4">
                  {searchResults.length} result
                  {searchResults.length !== 1 ? "s" : ""} for "{searchTerm}"
                </p>
                <ul className="space-y-3">
                  {searchResults.map((product) => (
                    <li key={product.id} className="snap-card">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex items-center"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                          {product.imageUrl && (
                            <ImprovedImage
                              src={product.imageUrl}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="snap-heading-3">{product.name}</h3>
                          <p className="snap-text-secondary">
                            {product.category}
                          </p>
                          <p className="snap-text font-bold mt-1">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="snap-heading-3 mb-2">No results found</h3>
                <p className="snap-text-secondary mb-6">
                  We couldn't find any products matching "{searchTerm}"
                </p>
                <button onClick={clearSearch} className="snap-button-secondary">
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
