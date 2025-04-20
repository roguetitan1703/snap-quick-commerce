"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "../../components/product/ProductCard";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronLeft,
  FiMapPin,
  FiList,
  FiGrid,
  FiMenu,
  FiChevronRight,
  FiHome,
  FiUser,
  FiCoffee,
  FiDroplet,
  FiCloud,
  FiTag,
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchParams?.get("search") || "";
  const categoryParam = searchParams?.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "All"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [categories, setCategories] = useState(initialCategories);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [viewMode, setViewMode] = useState("grid"); // grid or list view

  // Mobile state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Add new state for desktop sidebar collapsed state
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  // Fetch products from API
  const {
    products: apiProducts,
    loading,
    error,
    refetch,
  } = useProducts(
    selectedCategory !== "All" ? selectedCategory : undefined,
    searchQuery || undefined
  );

  // Re-fetch products when URL params change
  useEffect(() => {
    const newCategory =
      categoryParam && categoryParam !== "All" ? categoryParam : undefined;
    const newSearch = searchQuery || undefined;

    console.log("URL params changed:", {
      categoryParam: newCategory,
      searchQuery: newSearch,
    });

    // Update the local selectedCategory state to match URL if they're different
    if (categoryParam && categoryParam !== selectedCategory) {
      console.log("Updating selected category from URL:", categoryParam);
      setSelectedCategory(categoryParam);
    } else if (!categoryParam && selectedCategory !== "All") {
      console.log("Resetting selected category to All");
      setSelectedCategory("All");
    }

    // Only refetch if we didn't just trigger this URL change from handleCategoryChange
    // This prevents double fetching when the user clicks a category
    const isCategoryChangeFromUrl =
      newCategory !==
      (selectedCategory !== "All" ? selectedCategory : undefined);

    if (isCategoryChangeFromUrl || newSearch !== (searchQuery || undefined)) {
      console.log("Fetching products due to URL change");
      refetch(newCategory, newSearch);
    }
  }, [categoryParam, searchQuery, selectedCategory]);

  // Get unique categories from products
  useEffect(() => {
    // Create a map of all categories first (preserving initialCategories)
    const categoryMap = new Map();
    initialCategories.forEach((cat) => categoryMap.set(cat, true));

    // Add any new categories found in products if available
    if (apiProducts && apiProducts.length > 0) {
      apiProducts.forEach((product) => {
        if (product.category) {
          categoryMap.set(product.category, true);
        }
      });
    }

    // Convert map keys to array, ensuring "All" is first
    const allCategories = Array.from(categoryMap.keys());
    const sortedCategories = [
      "All",
      ...allCategories.filter((cat) => cat !== "All"),
    ];

    setCategories(sortedCategories);
  }, [apiProducts]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");

      if (
        sidebar &&
        isSidebarOpen &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname, searchParams]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with term:", searchInput.trim());

    // Create URL params for the category and search input
    const params = new URLSearchParams();
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    }
    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }

    // Force immediate data refetch with the new search parameters
    const categoryForApi =
      selectedCategory !== "All" ? selectedCategory : undefined;
    const searchForApi = searchInput.trim() || undefined;
    console.log("Forcing immediate search with:", {
      category: categoryForApi,
      search: searchForApi,
    });
    refetch(categoryForApi, searchForApi);

    // Update URL (this will also trigger the useEffect, but we've already fetched data)
    console.log("Updating URL with params:", params.toString());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);

    // Close mobile sidebar if open
    setIsSidebarOpen(false);
  };

  // Clear search
  const clearSearch = () => {
    console.log("Clearing search input");
    setSearchInput("");

    // Create URL params for just the category
    const params = new URLSearchParams();
    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }

    // Force immediate data refetch with cleared search
    const categoryForApi =
      selectedCategory !== "All" ? selectedCategory : undefined;
    console.log(
      "Forcing immediate search clear with category:",
      categoryForApi
    );
    refetch(categoryForApi, undefined);

    // Update URL
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    console.log("Changing category to:", category);

    // Create URL params for the new category
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (category !== "All") params.set("category", category);

    // Set the UI state for the selected category
    setSelectedCategory(category);

    // Force immediate data refetch with the new category
    // This ensures we don't wait for the URL change to trigger the refetch
    const categoryForApi = category !== "All" ? category : undefined;
    const searchForApi = searchInput || undefined;
    refetch(categoryForApi, searchForApi);

    // Update the URL
    router.push(`/products?${params.toString()}`);

    // Close mobile sidebar if open
    setIsSidebarOpen(false);
  };

  // Filter products based on price range
  const filteredProducts =
    apiProducts?.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    ) || [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center mb-4">
        <Link href="/" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Products</h1>
        <div className="ml-auto flex items-center space-x-2">
          {/* View toggle buttons */}
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100"
            }`}
            aria-label="Grid view"
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100"
            }`}
            aria-label="List view"
          >
            <FiList className="w-5 h-5" />
          </button>

          {/* Mobile sidebar toggle */}
          <button
            id="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100"
            aria-label="Toggle categories"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Filter button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 rounded-lg bg-gray-100"
            aria-label="Filter products"
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                const params = new URLSearchParams();
                if (selectedCategory !== "All") {
                  params.set("category", selectedCategory);
                }
                router.push(
                  `/products${params.toString() ? `?${params.toString()}` : ""}`
                );
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Mobile Sidebar Overlay - shows when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-24 p-2 border border-gray-300 rounded-md"
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-24 p-2 border border-gray-300 rounded-md"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Mobile Sidebar - Slide in from left on mobile */}
        <div
          id="mobile-sidebar"
          className={`fixed md:hidden top-0 left-0 h-full w-3/4 max-w-xs bg-white z-20 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`w-full text-left px-4 py-3 rounded-md text-sm ${
                  selectedCategory === category
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Categories Sidebar - Hidden on mobile */}
        <div
          className={`hidden md:block flex-shrink-0 transition-all duration-300 ${
            isDesktopSidebarCollapsed ? "w-16" : "w-48"
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-sm ${
              isDesktopSidebarCollapsed ? "p-2" : "p-4"
            } sticky top-20`}
          >
            <div className="flex items-center justify-between mb-4">
              {!isDesktopSidebarCollapsed && (
                <h2 className="text-base font-semibold">Categories</h2>
              )}
              <button
                onClick={() =>
                  setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
                }
                className="p-1 rounded-full hover:bg-gray-100 ml-auto"
                aria-label={
                  isDesktopSidebarCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
                }
              >
                {isDesktopSidebarCollapsed ? (
                  <FiChevronRight className="w-4 h-4" />
                ) : (
                  <FiChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left ${
                    isDesktopSidebarCollapsed
                      ? "px-2 py-2 justify-center"
                      : "px-3 py-2"
                  } rounded-md text-sm flex items-center ${
                    selectedCategory === category
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={category}
                >
                  {category === "All" && (
                    <FiGrid
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {category === "Dairy" && (
                    <FiList
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {category === "Household" && (
                    <FiHome
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {category === "Personal Care" && (
                    <FiUser
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {category === "Snacks" && (
                    <FiCoffee
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {category === "Beverages" && (
                    <FiDroplet
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {category === "Frozen Foods" && (
                    <FiCloud
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {![
                    "All",
                    "Dairy",
                    "Household",
                    "Personal Care",
                    "Snacks",
                    "Beverages",
                    "Frozen Foods",
                  ].includes(category) && (
                    <FiTag
                      className={`${
                        isDesktopSidebarCollapsed ? "" : "mr-2"
                      } h-4 w-4`}
                    />
                  )}
                  {!isDesktopSidebarCollapsed && <span>{category}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1 w-full overflow-hidden">
          {/* Current Category Indication - Mobile only */}
          <div className="md:hidden flex items-center mb-3 text-sm">
            <span className="text-gray-500">Category:</span>
            <span className="ml-2 font-medium text-indigo-600">
              {selectedCategory}
            </span>
          </div>

          {loading ? (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => router.refresh()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : sortedProducts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-36 h-36 bg-gray-50 relative flex-shrink-0 flex items-center justify-center">
                        <ImprovedImage
                          src={product.imageUrl || "/images/placeholder.svg"}
                          alt={product.name}
                          width={120}
                          height={120}
                          className="object-contain max-h-full max-w-full"
                          productName={product.name}
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-medium text-lg mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.category}
                        </p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="font-bold text-lg">
                            ₹{product.price.toFixed(2)}
                          </span>
                          <Link
                            href={`/products/${product.productId}`}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                          >
                            View Product
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchInput("");
                  setPriceRange([0, 300]);
                  router.push("/products");
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
