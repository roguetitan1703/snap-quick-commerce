"use client";

import React from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b border-gray-200">
        <Link href="/" className="mr-4">
          <FiArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
        <h1 className="text-lg font-semibold">My Account</h1>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
