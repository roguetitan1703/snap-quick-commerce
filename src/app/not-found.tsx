import React from "react";
import Link from "next/link";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
      <FiAlertTriangle className="w-20 h-20 text-gray-400 mb-6" />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>

      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <div className="space-y-4">
        <Link
          href="/"
          className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <Link
          href="/products"
          className="flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Go to Products
        </Link>
      </div>

      <div className="mt-16 text-gray-500 text-sm">
        <p>Snap Quick Commerce</p>
      </div>
    </div>
  );
}
