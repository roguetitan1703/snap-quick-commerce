"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiBell,
  FiShield,
  FiHelpCircle,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { useAuthContext } from "@/contexts/AuthContext";

// Define interfaces for navigation items
interface NavigationItem {
  icon: IconType;
  label: string;
  href: string;
  danger?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const AccountPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Don't render the page content if not authenticated
  if (!isAuthenticated || !user) {
    return null; // The useEffect will redirect
  }

  // Navigation sections
  const navigationSections: NavigationSection[] = [
    {
      title: "My Account",
      items: [
        { icon: FiPackage, label: "My Orders", href: "/account/orders" },
        { icon: FiHeart, label: "Wishlist", href: "/account/wishlist" },
      ],
    },
    {
      title: "Settings",
      items: [
        { icon: FiSettings, label: "App Settings", href: "/account/settings" },
        {
          icon: FiBell,
          label: "Notifications",
          href: "/account/notifications",
        },
        {
          icon: FiShield,
          label: "Privacy & Security",
          href: "/account/privacy",
        },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: FiHelpCircle, label: "Help Center", href: "/support" },
        {
          icon: FiLogOut,
          label: "Sign Out",
          href: "#",
          danger: true,
        },
      ],
    },
  ];

  // Handle logout
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
    router.push("/");
  };

  return (
    <div className="pb-20">
      {/* User Profile Section */}
      <div className="bg-white p-4 flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <FiUser className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">{user.username}</h1>
          <p className="text-sm text-gray-500">User ID: {user.userId}</p>
        </div>
        <Link
          href="/account/edit"
          className="px-3 py-1 text-sm rounded-full border border-gray-300 text-gray-700"
        >
          Edit
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="mt-4 space-y-4">
        {navigationSections.map((section) => (
          <div key={section.title} className="bg-white">
            <h2 className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
              {section.title}
            </h2>
            <ul>
              {section.items.map((item) => (
                <li
                  key={item.label}
                  className="border-b border-gray-100 last:border-0"
                >
                  <Link
                    href={item.href}
                    onClick={
                      item.label === "Sign Out" ? handleLogout : undefined
                    }
                    className={`flex items-center justify-between p-4 ${
                      item.danger ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`w-5 h-5 mr-3 ${
                          item.danger ? "text-red-500" : "text-gray-500"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {!item.danger && (
                      <FiChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* App Version */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Snap Quick Commerce v1.0.0</p>
      </div>
    </div>
  );
};

export default AccountPage;
