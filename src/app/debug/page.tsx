"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import Link from "next/link";
import { FiChevronLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";

const DebugPage = () => {
  const { isAuthenticated, user } = useAuthContext();
  const { addToCart, cartItems, loading: cartLoading } = useCart();

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [cartStructure, setCartStructure] = useState<string>("");

  // Function to directly make an axios request to the API
  const testDirectAxios = async () => {
    setIsLoading(true);
    try {
      // Get the base URL displayed for debugging
      const baseUrl = API_BASE_URL;

      // First attempt to fetch products to see if API is accessible
      const productsResponse = await axios.get(`${baseUrl}/products`);

      // Then try the cart endpoint
      const cartResponse = await axios.get(`${baseUrl}/cart`);

      // Finally try adding to cart - update to use the correct endpoint
      const addResponse = await axios.post(`${baseUrl}/cart`, {
        productId,
        quantity,
      });

      setResults([
        {
          name: "API Base URL",
          success: true,
          data: baseUrl,
          error: null,
        },
        {
          name: "Products API",
          success:
            productsResponse.status >= 200 && productsResponse.status < 300,
          data: productsResponse.data
            ? `Got ${
                Array.isArray(productsResponse.data)
                  ? productsResponse.data.length
                  : "some"
              } products`
            : null,
          status: productsResponse.status,
          error:
            productsResponse.status >= 400
              ? `Error ${productsResponse.status}`
              : null,
        },
        {
          name: "Cart API",
          success: cartResponse.status >= 200 && cartResponse.status < 300,
          data: null,
          status: cartResponse.status,
          error:
            cartResponse.status >= 400 ? `Error ${cartResponse.status}` : null,
        },
        {
          name: "Add to Cart API",
          success: addResponse.status >= 200 && addResponse.status < 300,
          data: addResponse.data
            ? JSON.stringify(addResponse.data).substring(0, 100)
            : null,
          status: addResponse.status,
          error:
            addResponse.status >= 400 ? `Error ${addResponse.status}` : null,
        },
      ]);
    } catch (error: any) {
      console.error("Debug test error", error);
      setResults([
        {
          name: "API Error",
          success: false,
          data: null,
          error: error.message,
        },
        {
          name: "Error Details",
          success: false,
          data: null,
          error: error.response
            ? `Status: ${error.response.status}, Data: ${JSON.stringify(
                error.response.data
              )}`
            : "No response data available",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Test using the useCart hook
  const testUseCartHook = async () => {
    setIsLoading(true);
    try {
      // Create test product
      const testProduct = {
        productId,
        name: "Test Product",
        description: "Test product for debugging",
        price: 10.99,
        category: "Debug",
        imageUrl: "/images/products/test.svg",
        currentStock: 10,
      };

      await addToCart(productId, testProduct, quantity);
      setResults((prev) => [
        ...prev,
        {
          name: "Add via useCart hook",
          success: true,
          data: `Added ${testProduct.name} (ID: ${productId})`,
          error: null,
        },
      ]);
    } catch (error: any) {
      console.error("useCart hook error", error);
      setResults((prev) => [
        ...prev,
        {
          name: "Add via useCart hook",
          success: false,
          data: null,
          error: error.message || "Unknown error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze cart structure
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Create a structured view of the cart items
      const cartItemsStructure = cartItems.map((item) => {
        const hasValidProduct =
          item.product && typeof item.product.productId === "number";
        return {
          itemId: item.itemId,
          quantity: item.quantity,
          hasValidProduct,
          productId: item.product?.productId || "undefined",
          name: item.product?.name || "undefined",
          price: item.product?.price || "undefined",
        };
      });

      setCartStructure(JSON.stringify(cartItemsStructure, null, 2));
    } else {
      setCartStructure("No cart items available");
    }
  }, [cartItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-indigo-600 mr-4">
          <FiChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold">API Debug Page</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Auth Status</h2>
        <p className="mb-2">
          <span className="font-medium">Auth Status:</span>{" "}
          {isAuthenticated ? (
            <span className="text-green-600">Authenticated</span>
          ) : (
            <span className="text-red-600">Not Authenticated</span>
          )}
        </p>
        {user && (
          <p className="mb-2">
            <span className="font-medium">User:</span> {user.username} (ID:{" "}
            {user.userId})
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Cart Structure</h2>
        <p className="mb-2 text-sm">
          {cartLoading ? (
            "Loading cart data..."
          ) : (
            <>
              <span className="font-medium">Items in cart:</span>{" "}
              {cartItems?.length || 0}
            </>
          )}
        </p>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-auto max-h-80">
          <pre className="text-xs">{cartStructure}</pre>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Test API Connection</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Product ID</label>
            <input
              type="number"
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={testDirectAxios}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {isLoading ? "Testing..." : "Test Direct Axios"}
          </button>

          <button
            onClick={testUseCartHook}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md"
          >
            {isLoading ? "Testing..." : "Test useCart Hook"}
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                {result.success ? (
                  <FiCheckCircle
                    size={20}
                    className="text-green-600 mr-2 mt-0.5"
                  />
                ) : (
                  <FiAlertCircle
                    size={20}
                    className="text-red-600 mr-2 mt-0.5"
                  />
                )}
                <div>
                  <h3 className="font-medium">{result.name}</h3>

                  {result.data && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Data:</span> {result.data}
                    </p>
                  )}

                  {result.status && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Status:</span>{" "}
                      {result.status}
                    </p>
                  )}

                  {result.error && (
                    <p className="text-sm mt-1 text-red-700">
                      <span className="font-medium">Error:</span> {result.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
