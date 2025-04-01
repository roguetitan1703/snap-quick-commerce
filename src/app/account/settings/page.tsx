"use client";

import React from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiBell,
  FiGlobe,
  FiInfo,
  FiCreditCard,
  FiShield,
  FiFileText,
  FiHelpCircle,
  FiChevronRight,
  FiGrid,
  FiMoon,
  FiSun,
} from "react-icons/fi";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Preferences Section */}
        <div className="bg-white rounded-lg overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Preferences
          </h2>

          <div className="divide-y divide-gray-100">
            <Link
              href="/account/notifications"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiBell className="text-indigo-600" />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiGlobe className="text-blue-600" />
                </div>
                <span className="font-medium">Language</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">English</span>
                <FiChevronRight className="text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiGrid className="text-gray-600" />
                </div>
                <span className="font-medium">App Appearance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-100 rounded-full p-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm">
                    <FiSun className="text-amber-500" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full">
                    <FiMoon className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-lg overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Privacy & Security
          </h2>

          <div className="divide-y divide-gray-100">
            <Link
              href="/account/privacy"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <FiShield className="text-green-600" />
                </div>
                <span className="font-medium">Privacy Settings</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>

            <Link
              href="/account/payment-methods"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiCreditCard className="text-purple-600" />
                </div>
                <span className="font-medium">Payment Methods</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            About
          </h2>

          <div className="divide-y divide-gray-100">
            <Link
              href="#"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiHelpCircle className="text-orange-600" />
                </div>
                <span className="font-medium">Help & Support</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>

            <Link
              href="#"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiFileText className="text-blue-600" />
                </div>
                <span className="font-medium">Terms of Service</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>

            <Link
              href="#"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiFileText className="text-blue-600" />
                </div>
                <span className="font-medium">Privacy Policy</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiInfo className="text-gray-600" />
                </div>
                <span className="font-medium">App Version</span>
              </div>
              <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                1.2.0
              </span>
            </div>
          </div>
        </div>

        {/* Log Out Button */}
        <Link
          href="/login"
          className="block w-full bg-white py-4 text-center text-red-600 font-medium rounded-lg shadow-sm mt-4"
        >
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
