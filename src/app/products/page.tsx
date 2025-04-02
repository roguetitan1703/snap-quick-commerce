"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/product/ProductCard";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronLeft,
  FiMapPin,
} from "react-icons/fi";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import ImprovedImage from "@/components/ui/ImprovedImage";

// Available categories - will be populated from API data
const initialCategories = [
  "All",
  "Dairy",
  "Household",
  "Personal Care",
  "Snacks",
  "Beverages",
  "Frozen Foods",
];

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";
  const categoryParam = searchParams?.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "All"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [categories, setCategories] = useState(initialCategories);

  // Fetch products from API
  const {
    products: apiProducts,
    loading,
    error,
  } = useProducts(
    selectedCategory !== "All" ? selectedCategory : undefined,
    searchQuery || undefined
  );

  // Get unique categories from products
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      const uniqueCategories = [
        "All",
        ...new Set(apiProducts.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [apiProducts]);

  // Apply client-side filters and sorting
  const filteredProducts = React.useMemo(() => {
    if (!apiProducts) return [];

    let filtered = [...apiProducts];

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting by id
        filtered.sort((a, b) => a.productId - b.productId);
        break;
    }

    return filtered;
  }, [apiProducts, sortOption, priceRange]);

  console.log(filteredProducts);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const index = name === "min" ? 0 : 1;
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="pb-20">
      {/* Header with back button and title */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">
          {searchQuery
            ? `Search: ${searchQuery}`
            : selectedCategory !== "All"
            ? selectedCategory
            : "All Products"}
        </h1>
        <button
          onClick={toggleFilter}
          className="ml-auto p-2 rounded-full bg-gray-100"
          aria-label="Filter products"
        >
          <FiFilter className="w-5 h-5" />
        </button>
      </div>

      {/* Category navigation */}
      <div className="snap-container overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2 py-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="snap-container py-10 text-center">
          <div className="animate-pulse flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="snap-container py-10 text-center">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <div className="snap-container">
          {filteredProducts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 py-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
          <div className="w-4/5 bg-white h-full overflow-auto p-4 animate-slide-in-right">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={closeFilter}
                className="p-2 rounded-full bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Sort options */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Sort By</h3>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Price Range</h3>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-500">Min</label>
                  <input
                    type="number"
                    name="min"
                    value={priceRange[0]}
                    onChange={handlePriceChange}
                    min="0"
                    max={priceRange[1]}
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-500">Max</label>
                  <input
                    type="number"
                    name="max"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    min={priceRange[0]}
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Apply filters button */}
            <button
              onClick={closeFilter}
              className="w-full py-3 bg-primary text-white rounded-lg mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
