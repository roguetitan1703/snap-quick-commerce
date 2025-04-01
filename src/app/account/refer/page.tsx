"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronLeft,
  FiGift,
  FiShare2,
  FiCopy,
  FiCheck,
  FiUsers,
} from "react-icons/fi";
import { FaWhatsapp, FaTelegram, FaFacebook } from "react-icons/fa";

const ReferPage = () => {
  const [copied, setCopied] = useState(false);
  const referralCode =
    "SNP" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://snapquick.com/refer?code=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareViaWhatsApp = () => {
    const message = `Hey! Use my referral code ${referralCode} to get ₹100 off on your first order from Snap Quick! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareViaTelegram = () => {
    const message = `Hey! Use my referral code ${referralCode} to get ₹100 off on your first order from Snap Quick! ${referralLink}`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        referralLink
      )}&text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Refer & Earn</h1>
      </div>

      {/* Referral Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg p-4 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">
              Refer friends & earn rewards
            </h2>
            <p className="text-sm opacity-90 mb-4">
              Get ₹100 for each friend who places their first order with your
              referral code
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FiGift className="text-indigo-600" />
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FiUsers className="text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="white">
              <path d="M21,14.12L14.12,21L12,18.88L18.88,12L21,14.12M3,3V12H12V3H3M14,14V21H21V14H14M14,3V12H21V3H14M3,14V21H12V14H3Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white p-4 mb-3">
        <h2 className="text-lg font-semibold mb-3">How it works</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-indigo-600 font-medium">1</span>
            </div>
            <div>
              <p className="font-medium">Share your referral code</p>
              <p className="text-sm text-gray-600">
                Share your unique code with friends and family
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-indigo-600 font-medium">2</span>
            </div>
            <div>
              <p className="font-medium">Friend orders with your code</p>
              <p className="text-sm text-gray-600">
                Your friend gets ₹100 off on their first order
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-indigo-600 font-medium">3</span>
            </div>
            <div>
              <p className="font-medium">You earn rewards</p>
              <p className="text-sm text-gray-600">
                You get ₹100 in your Snap Quick wallet once they complete their
                first order
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white p-4 mb-3">
        <h2 className="text-lg font-semibold mb-3">Your Referral Code</h2>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-mono font-bold tracking-wider text-indigo-600">
              {referralCode}
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-full bg-indigo-100 text-indigo-600"
            >
              {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
            </button>
          </div>
        </div>

        <h3 className="font-medium mb-2">Share your referral link</h3>
        <div className="relative">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 bg-gray-50 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600"
          >
            {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
          </button>
        </div>

        {copied && (
          <div className="mt-2 text-center text-sm text-green-600">
            Link copied to clipboard!
          </div>
        )}
      </div>

      {/* Share options */}
      <div className="bg-white p-4 mb-3">
        <h2 className="text-lg font-semibold mb-3">Share via</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={shareViaWhatsApp}
            className="flex flex-col items-center justify-center bg-green-50 rounded-lg py-3"
          >
            <FaWhatsapp size={28} className="text-green-600 mb-1" />
            <span className="text-xs">WhatsApp</span>
          </button>

          <button
            onClick={shareViaTelegram}
            className="flex flex-col items-center justify-center bg-blue-50 rounded-lg py-3"
          >
            <FaTelegram size={28} className="text-blue-500 mb-1" />
            <span className="text-xs">Telegram</span>
          </button>

          <button
            onClick={shareViaFacebook}
            className="flex flex-col items-center justify-center bg-blue-50 rounded-lg py-3"
          >
            <FaFacebook size={28} className="text-blue-700 mb-1" />
            <span className="text-xs">Facebook</span>
          </button>
        </div>
      </div>

      {/* Referral Status */}
      <div className="bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Your Referrals</h2>
        <div className="flex justify-between mb-4">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-xs text-gray-600">Total Referrals</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-indigo-600">₹0</p>
            <p className="text-xs text-gray-600">Total Earned</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-indigo-600">₹0</p>
            <p className="text-xs text-gray-600">Available Balance</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600 text-sm">
            You haven't referred anyone yet
          </p>
          <button
            className="mt-2 text-indigo-600 text-sm font-medium flex items-center mx-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FiShare2 className="mr-1" size={14} />
            Start sharing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferPage;
