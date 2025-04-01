"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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

// Dummy user data (will be from authentication system)
const user = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  profileImage:
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
};

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
        { icon: FiLogOut, label: "Sign Out", href: "/logout", danger: true },
      ],
    },
  ];

  return (
    <div className="pb-20">
      {/* User Profile Section */}
      <div className="bg-white p-4 flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FiUser className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
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
