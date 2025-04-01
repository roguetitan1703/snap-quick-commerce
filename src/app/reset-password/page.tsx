"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiLock, FiAlertCircle, FiChevronLeft, FiCheck } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would call an API endpoint with the token and new password
      console.log(
        "Reset password with token:",
        token,
        "New password:",
        password
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setIsResetComplete(true);
    } catch (error) {
      console.error("Password reset failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no token is provided, show error message
  if (!token && !isResetComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
          <Link href="/login" className="mr-3">
            <FiChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="snap-heading-1">Reset Password</h1>
        </div>

        <div className="px-4 py-6 flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="snap-heading-1">Invalid or Expired Link</h2>
            <p className="snap-text-secondary mt-3 mb-6">
              The password reset link is invalid or expired. Please request a
              new link.
            </p>
            <Link
              href="/forgot-password"
              className="snap-button-primary py-3 px-6 rounded-lg"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/login" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">Reset Password</h1>
      </div>

      <div className="px-4 py-6 flex-1 flex flex-col">
        {!isResetComplete ? (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <FiLock className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="snap-heading-1">Create new password</h2>
              <p className="snap-text-secondary mt-1">
                Your new password must be different from previously used
                passwords
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="snap-text font-medium mb-1 block"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="snap-text font-medium mb-1 block"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <p className="snap-text-secondary text-xs">
                Your password should be at least 6 characters long and include a
                mix of letters, numbers, and symbols for better security.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="snap-button-primary w-full py-3 rounded-lg"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center flex-1">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="snap-heading-1 mb-2">Password Reset Complete</h2>
            <p className="snap-text-secondary mb-8">
              Your password has been successfully reset.
              <br />
              You can now log in with your new password.
            </p>
            <Link
              href="/login"
              className="snap-button-primary py-3 px-6 rounded-lg"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
