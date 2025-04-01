"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";

const NavBar: React.FC = () => {
  const pathname = usePathname();

  // Determine if we're on a page that needs a back button
  const showBackButton = pathname !== "/" && pathname !== "/products";

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/products") return "All Products";
    if (pathname?.startsWith("/products/")) return "Product Details";
    if (pathname === "/cart") return "Shopping Cart";
    if (pathname === "/search") return "Search";
    if (pathname === "/account") return "My Account";
    if (pathname === "/login") return "Sign In";
    if (pathname === "/register") return "Create Account";

    return "Snap";
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 h-14 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton ? (
            <Link
              href="javascript:history.back()"
              className="p-2 -ml-2 rounded-full text-gray-600"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              <FiShoppingBag className="w-6 h-6 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-indigo-600">
                Snap
              </span>
            </Link>
          )}
        </div>

        <div className="text-center">
          {showBackButton && (
            <h1 className="text-lg font-medium text-gray-800">
              {getPageTitle()}
            </h1>
          )}
        </div>

        <div className="w-10 flex justify-end">
          {/* ThemeSwitcher removed */}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
