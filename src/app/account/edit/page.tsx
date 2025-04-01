"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCamera,
  FiCheck,
} from "react-icons/fi";

// Sample user data (would be fetched from API in a real app)
const sampleUser = {
  name: "Aditya Sharma",
  email: "aditya.sharma@gmail.com",
  phone: "+91 9876543210",
  avatar: "https://randomuser.me/api/portraits/men/44.jpg",
};

const EditProfilePage = () => {
  const [user, setUser] = useState(sampleUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg p-4 mb-4">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={user.avatar}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                <FiCamera size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-600">Tap to change profile photo</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 flex items-center">
              <FiCheck className="mr-2" />
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Account Settings</h2>

          <Link
            href="/account/privacy"
            className="flex items-center justify-between py-3 border-t"
          >
            <span className="text-gray-800">Change Password</span>
            <FiChevronLeft className="transform rotate-180" />
          </Link>

          <Link
            href="/account/delete"
            className="flex items-center justify-between py-3 border-t text-red-600"
          >
            <span>Delete Account</span>
            <FiChevronLeft className="transform rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
