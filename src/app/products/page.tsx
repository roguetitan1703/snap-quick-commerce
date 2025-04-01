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
import ImprovedImage from "@/components/ui/ImprovedImage";



// Sample product data for quick commerce groceries
const allProducts = [
  {
    id: "1",
    name: "Organic Bananas (6 pcs)",
    price: 4.99,
    imageUrl:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fruits & Vegetables",
    currentStock: 50,
  },
  {
    id: "2",
    name: "Fresh Milk 1L",
    price: 2.99,
    imageUrl: "/images/products/milk.jpg",
    category: "Dairy & Eggs",
    currentStock: 35,
  },
  {
    id: "3",
    name: "Brown Eggs (6 pcs)",
    price: 3.49,
    imageUrl:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Dairy & Eggs",
    currentStock: 24,
  },
  {
    id: "4",
    name: "Sourdough Bread",
    price: 5.99,
    imageUrl: "/images/products/bread.svg",
    category: "Bakery",
    isNew: true,
  },
  {
    id: "5",
    name: "Avocado (2 pcs)",
    price: 3.59,
    imageUrl:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fruits & Vegetables",
    currentStock: 30,
  },
  {
    id: "6",
    name: "Greek Yogurt",
    price: 4.49,
    imageUrl: "/images/products/yogurt.jpg",
    category: "Dairy & Eggs",
    discount: 15,
    currentStock: 18,
  },
  {
    id: "7",
    name: "Almond Milk 1L",
    price: 3.99,
    imageUrl: "/images/products/almond-milk.svg",
    category: "Dairy & Eggs",
    discount: 20,
    currentStock: 15,
  },
  {
    id: "8",
    name: "Organic Spinach 250g",
    price: 2.49,
    imageUrl: "/images/products/spinach.jpg",
    category: "Fruits & Vegetables",
    currentStock: 40,
  },
  {
    id: "9",
    name: "Fresh Strawberries 250g",
    price: 4.29,
    imageUrl: "/images/products/strawberries.svg",
    category: "Fruits & Vegetables",
    currentStock: 22,
    isNew: true,
  },
  {
    id: "10",
    name: "Mixed Berries Pack",
    price: 8.99,
    imageUrl: "/images/products/berries.svg",
    category: "Fruits & Vegetables",
    discount: 25,
    currentStock: 12,
  },
  {
    id: "11",
    name: "Toilet Paper 6 Rolls",
    price: 5.99,
    imageUrl: "/images/products/toilet-paper.svg",
    category: "Home & Cleaning",
    currentStock: 60,
  },
  {
    id: "12",
    name: "Liquid Hand Soap 250ml",
    price: 3.79,
    imageUrl: "/images/products/soap.svg",
    category: "Personal Care",
    currentStock: 45,
  },
];

// Available categories for groceries
const categories = [
  "All",
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Bakery",
  "Personal Care",
  "Home & Cleaning",
  "Snacks",
  "Beverages",
];

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";
  const categoryParam = searchParams?.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "All"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [productsList, setProductsList] = useState(allProducts);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 200]);

  // Filter products based on category and search
  useEffect(() => {
    let filtered = [...productsList];

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply search filter if exists
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.category &&
            product.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

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
      case "newest":
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        // Default sorting (by id) - no change needed
        break;
    }

    setFilteredProducts(filtered);
  }, [productsList, selectedCategory, searchQuery, sortOption, priceRange]);

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
              className={`snap-chip ${
                selectedCategory === category ? "snap-chip-active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Filter drawer - shows when filter button is clicked */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 overflow-hidden ${
          isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeFilter}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white transform transition-transform duration-300 overflow-y-auto ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="snap-heading-2">Filters</h2>
              <button onClick={closeFilter} className="p-2">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Sort options */}
            <div className="mb-6">
              <h3 className="snap-heading-3 mb-2">Sort By</h3>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <h3 className="snap-heading-3 mb-2">Price Range</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <label className="snap-text-secondary text-xs mb-1 block">
                    Min
                  </label>
                  <input
                    type="number"
                    name="min"
                    value={priceRange[0]}
                    onChange={handlePriceChange}
                    min="0"
                    max={priceRange[1]}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="snap-text-secondary text-xs mb-1 block">
                    Max
                  </label>
                  <input
                    type="number"
                    name="max"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    min={priceRange[0]}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Apply filters button */}
            <button
              onClick={closeFilter}
              className="snap-button-primary w-full"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="snap-container">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                category={product.category}
                currentStock={product.currentStock}
                discount={product.discount}
                isNew={product.isNew}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="snap-heading-3 mb-2">No products found</h3>
            <p className="snap-text-secondary mb-6">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
