"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiLock,
  FiEye,
  FiDownload,
  FiTrash2,
  FiAlertTriangle,
  FiShield,
  FiToggleRight,
  FiChevronRight,
  FiInfo,
} from "react-icons/fi";

const PrivacySecurityPage = () => {
  const [showOrderHistory, setShowOrderHistory] = useState("private");
  const [saveAddresses, setSaveAddresses] = useState(true);
  const [personalizedOffers, setPersonalizedOffers] = useState(true);
  const [usageData, setUsageData] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account/settings" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Privacy & Security</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <FiInfo className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Your privacy is important to us. Control how your data is used and
            stored.
          </p>
        </div>

        {/* Password & Security */}
        <div className="bg-white rounded-lg overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Account Security
          </h2>

          <div className="divide-y divide-gray-100">
            <Link
              href="/account/change-password"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiLock className="text-indigo-600" />
                </div>
                <div>
                  <span className="font-medium block">Change Password</span>
                  <span className="text-xs text-gray-500">
                    Last changed 30 days ago
                  </span>
                </div>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>

            <Link
              href="/account/login-activity"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <FiShield className="text-green-600" />
                </div>
                <div>
                  <span className="font-medium block">Login Activity</span>
                  <span className="text-xs text-gray-500">
                    Review recent device logins
                  </span>
                </div>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Privacy Settings
          </h2>

          <div className="divide-y divide-gray-100">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiEye className="text-blue-600" />
                  </div>
                  <span className="font-medium">Order History Visibility</span>
                </div>
              </div>

              <div className="ml-12">
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    className={`py-2 px-3 rounded-lg text-sm font-medium ${
                      showOrderHistory === "private"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setShowOrderHistory("private")}
                  >
                    Private
                  </button>
                  <button
                    className={`py-2 px-3 rounded-lg text-sm font-medium ${
                      showOrderHistory === "friends"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setShowOrderHistory("friends")}
                  >
                    Friends
                  </button>
                  <button
                    className={`py-2 px-3 rounded-lg text-sm font-medium ${
                      showOrderHistory === "public"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setShowOrderHistory("public")}
                  >
                    Public
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiToggleRight className="text-purple-600" />
                </div>
                <div>
                  <span className="font-medium block">
                    Save Delivery Addresses
                  </span>
                  <span className="text-xs text-gray-500">
                    Store addresses for faster checkout
                  </span>
                </div>
              </div>
              <button
                className={`w-12 h-6 rounded-full flex items-center ${
                  saveAddresses
                    ? "bg-indigo-600 justify-end"
                    : "bg-gray-300 justify-start"
                } p-1 transition-colors`}
                onClick={() => setSaveAddresses(!saveAddresses)}
              >
                <span className="block w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Personalization */}
        <div className="bg-white rounded-lg overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Data & Personalization
          </h2>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                  <FiToggleRight className="text-amber-600" />
                </div>
                <div>
                  <span className="font-medium block">Personalized Offers</span>
                  <span className="text-xs text-gray-500">
                    Receive personalized recommendations
                  </span>
                </div>
              </div>
              <button
                className={`w-12 h-6 rounded-full flex items-center ${
                  personalizedOffers
                    ? "bg-indigo-600 justify-end"
                    : "bg-gray-300 justify-start"
                } p-1 transition-colors`}
                onClick={() => setPersonalizedOffers(!personalizedOffers)}
              >
                <span className="block w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                  <FiToggleRight className="text-amber-600" />
                </div>
                <div>
                  <span className="font-medium block">
                    Usage Data Collection
                  </span>
                  <span className="text-xs text-gray-500">
                    Help improve our app with analytics
                  </span>
                </div>
              </div>
              <button
                className={`w-12 h-6 rounded-full flex items-center ${
                  usageData
                    ? "bg-indigo-600 justify-end"
                    : "bg-gray-300 justify-start"
                } p-1 transition-colors`}
                onClick={() => setUsageData(!usageData)}
              >
                <span className="block w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiDownload className="text-blue-600" />
                </div>
                <div>
                  <span className="font-medium block">Download Your Data</span>
                  <span className="text-xs text-gray-500">
                    Get a copy of your personal data
                  </span>
                </div>
              </div>

              <button className="ml-12 mt-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
                Request Data Download
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-lg overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider bg-red-50 text-red-500">
            Danger Zone
          </h2>

          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                <FiAlertTriangle className="text-red-600" />
              </div>
              <div>
                <span className="font-medium block">Delete Your Account</span>
                <span className="text-xs text-gray-500">
                  This will permanently remove all your data
                </span>
              </div>
            </div>

            <div className="ml-12 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-red-700">
                Deleting your account will remove all of your information from
                our database. This cannot be undone.
              </p>
            </div>

            <Link
              href="/account/delete"
              className="ml-12 inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Delete Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
