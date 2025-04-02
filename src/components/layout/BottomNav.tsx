"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiGrid,
} from "react-icons/fi";
import { useCart } from "@/hooks/useCart";

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartTotal } = useCart();
  const cartItemCount = cartTotal.totalItems;

  const navItems = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/products", label: "Products", icon: FiGrid },
    { href: "/search", label: "Search", icon: FiSearch },
    {
      href: "/cart",
      label: "Cart",
      icon: FiShoppingCart,
      badge: cartItemCount > 0 ? cartItemCount : null,
    },
    { href: "/account", label: "Account", icon: FiUser },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-10 max-w-[100vw] overflow-hidden">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
