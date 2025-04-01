"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMail, FiAlertCircle, FiChevronLeft, FiCheck } from "react-icons/fi";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would call an API endpoint
      console.log("Reset password for:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset request failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/login" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">Forgot Password</h1>
      </div>

      <div className="px-4 py-6 flex-1 flex flex-col">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <FiMail className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="snap-heading-1">Reset your password</h2>
              <p className="snap-text-secondary mt-1">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="snap-text font-medium mb-1 block"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      error ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="you@example.com"
                  />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="snap-button-primary w-full py-3 rounded-lg"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center flex-1">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="snap-heading-1 mb-2">Email sent</h2>
            <p className="snap-text-secondary mb-8">
              We've sent a password reset link to <br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>
            <Link
              href="/login"
              className="snap-button-primary py-3 px-6 rounded-lg"
            >
              Back to Login
            </Link>
            <p className="snap-text-secondary mt-6 text-sm">
              Didn't receive the email?{" "}
              <button
                className="text-indigo-600 font-medium"
                onClick={() => setIsSubmitted(false)}
              >
                Try again
              </button>
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="snap-text">
            Remember your password?{" "}
            <Link href="/login" className="text-indigo-600 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
