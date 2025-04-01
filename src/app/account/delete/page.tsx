"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiAlertTriangle,
  FiLock,
  FiCheck,
} from "react-icons/fi";

const DeleteAccountPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeletionComplete, setIsDeletionComplete] = useState(false);

  const handleRequestDelete = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter your password to confirm");
      return;
    }

    setError("");
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      // Simulate API call to delete account
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsDeletionComplete(true);

      // In a real app, this would redirect to login after account deletion
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account/edit" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Delete Account</h1>
      </div>

      <div className="p-4">
        {!isDeletionComplete ? (
          !isConfirmingDelete ? (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-center mb-2">
                Delete Your Account
              </h2>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Warning:</strong> This action cannot be undone.
                </p>
                <p className="text-sm text-red-800">
                  Deleting your account will permanently remove all your data,
                  including order history, saved addresses, and preferences.
                </p>
              </div>

              <form onSubmit={handleRequestDelete} className="mb-4">
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Enter your password to continue
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium mb-3"
                >
                  Continue
                </button>

                <Link
                  href="/account"
                  className="block w-full text-center py-3 border border-gray-300 rounded-lg font-medium"
                >
                  Cancel
                </Link>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-center mb-6">
                Are you absolutely sure?
              </h2>

              <div className="space-y-4 mb-6">
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium"
                >
                  {isDeleting
                    ? "Deleting Account..."
                    : "Yes, Delete My Account"}
                </button>

                <button
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
                >
                  No, Keep My Account
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">Account Deleted</h2>
            <p className="text-gray-600 mb-4">
              Your account has been successfully deleted. You will be redirected
              to the login page.
            </p>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-progress"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountPage;
