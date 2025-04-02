"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLock, FiMail, FiAlertCircle, FiChevronLeft } from "react-icons/fi";
import { useAuthContext } from "@/contexts/AuthContext";

const LoginPage = () => {
  const {
    login,
    error: authError,
    isLoading,
    isAuthenticated,
  } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [loginResponse, setLoginResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, router, redirect]);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    // Username validation
    if (!username) {
      newErrors.username = "Username is required";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoginResponse(null);

    if (!validateForm()) {
      return;
    }

    try {
      console.log("Login attempt with:", {
        username: username,
        passwordLength: password.length,
      });

      // Show loading state
      setLoading(true);

      // Call login and store full response for debugging
      await login(username, password);

      // If we got here, login was successful
      console.log("Login successful, redirecting to:", redirect);
      router.push(redirect);

      // For debugging purposes, store the success response
      setLoginResponse({ success: true, message: "Login successful" });
    } catch (err: any) {
      console.error("Login exception:", err);

      // Store error response for debugging
      setLoginResponse({
        success: false,
        error: err.message || "An unexpected error occurred",
      });

      setErrors({
        username:
          err.message || "An unexpected error occurred. Please try again.",
        password:
          err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">Login</h1>
      </div>

      <div className="px-4 py-6 flex-1 flex flex-col">
        {/* App logo */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-indigo-600 font-bold text-xl">Snap</span>
          </div>
          <h2 className="snap-heading-1">Welcome back!</h2>
          <p className="snap-text-secondary mt-1">Login to continue shopping</p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
            <FiAlertCircle className="h-5 w-5 mr-2" />
            {authError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="snap-text font-medium mb-1 block"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.username ? "border-red-300" : "border-gray-300"
                } rounded-lg shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="your_username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="h-4 w-4 mr-1" />
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="snap-text font-medium mb-1 block"
            >
              Password
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

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="snap-text-secondary font-medium text-indigo-600"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="snap-button-primary w-full py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="snap-text">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium">
              Sign up
            </Link>
          </p>
          {redirect && redirect !== "/" && (
            <p className="mt-2 text-sm text-gray-600">
              You'll be redirected to: {redirect}
            </p>
          )}
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white snap-text-secondary">
                Or login with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white snap-text font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white snap-text font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {loginResponse && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs overflow-auto">
            <pre>{JSON.stringify(loginResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
