"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiMessageCircle,
  FiMail,
  FiPhone,
} from "react-icons/fi";

// FAQ data
const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by going to 'My Account' > 'My Orders' and selecting the order you want to track. You will see the current status of your order and a tracking number if the order has been shipped.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery for most items. The item must be in its original condition and packaging. To start a return, go to 'My Account' > 'My Orders' and select the order you want to return.",
  },
  {
    question: "How can I change my shipping address?",
    answer:
      "If your order hasn't been shipped yet, you can change the shipping address by contacting our customer service team. If the order has already been shipped, we won't be able to change the address.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping usually takes 3-5 business days. Express shipping options are available at checkout for 1-2 business day delivery.",
  },
];

// FAQ Accordion component
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        className="flex items-center justify-between w-full py-4 px-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <FiChevronUp className="flex-shrink-0" />
        ) : (
          <FiChevronDown className="flex-shrink-0" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 text-gray-600">{answer}</div>}
    </div>
  );
};

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="pb-20">
      <div className="bg-white px-4 py-5 flex items-center">
        <Link href="/account" className="mr-2">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Help Center</h1>
      </div>

      {/* Search bar */}
      <div className="bg-white p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-4 bg-white">
        <h2 className="px-4 py-2 text-lg font-medium border-b">
          Frequently Asked Questions
        </h2>
        <div>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Contact options */}
      <div className="mt-4 bg-white p-4">
        <h2 className="text-lg font-medium mb-4">Contact Us</h2>
        <div className="space-y-4">
          <Link href="#" className="flex items-center p-3 border rounded-lg">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <FiMessageCircle className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <p className="text-sm text-gray-500">
                Available 9am-6pm on weekdays
              </p>
            </div>
          </Link>

          <Link
            href="mailto:support@snapquick.com"
            className="flex items-center p-3 border rounded-lg"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <FiMail className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">Email Support</h3>
              <p className="text-sm text-gray-500">support@snapquick.com</p>
            </div>
          </Link>

          <Link
            href="tel:+18001234567"
            className="flex items-center p-3 border rounded-lg"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <FiPhone className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">Phone Support</h3>
              <p className="text-sm text-gray-500">1-800-123-4567</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
