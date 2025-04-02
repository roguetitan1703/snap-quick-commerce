"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import api, { productsApi } from "@/utils/api";
import Link from "next/link";

export default function DebugPage() {
  const [directFetchResult, setDirectFetchResult] =
    useState<string>("Loading...");
  const [apiFetchResult, setApiFetchResult] = useState<string>("Loading...");
  const [apiUtilityResult, setApiUtilityResult] =
    useState<string>("Loading...");
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const [corsTestResult, setCorsTestResult] = useState<string>("Not tested");
  const [headerTestResult, setHeaderTestResult] = useState<any>(null);
  const [testEndpointUrl, setTestEndpointUrl] = useState<string>(
    "http://localhost:8081/api/debug/headers"
  );
  const [backendTestUrl, setBackendTestUrl] = useState<string>(
    "http://localhost:8081/api/debug/health"
  );
  const [backendTestResult, setBackendTestResult] =
    useState<string>("Not tested");
  const [lastSuccessfulResponse, setLastSuccessfulResponse] =
    useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<string>("Checking...");
  const [networkTestEndpoint, setNetworkTestEndpoint] = useState<string>(
    "http://localhost:8081/api/debug/test-cors"
  );

  // Get the current hostname for proper API URLs
  const [hostname, setHostname] = useState<string>("localhost");
  const [backendUrl, setBackendUrl] = useState<string>(
    "http://localhost:8081/api"
  );

  useEffect(() => {
    // Get the current hostname when component mounts
    if (typeof window !== "undefined") {
      const currentHostname = window.location.hostname;
      setHostname(currentHostname);
      setBackendUrl(`http://${currentHostname}:8081/api`);

      // Update all test URLs
      setBackendTestUrl(`http://${currentHostname}:8081/api/debug/health`);
      setNetworkTestEndpoint(
        `http://${currentHostname}:8081/api/debug/test-cors`
      );
      setTestEndpointUrl(`http://${currentHostname}:8081/api/debug/headers`);
    }
  }, []);

  // Check if backend is running
  const checkBackendStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}/debug/health`, {
        timeout: 5000,
        validateStatus: () => true,
      });
      console.log("Health check response:", response);

      if (response.status >= 200 && response.status < 300) {
        setBackendStatus(
          `Backend is running (port 8081) - Product count: ${
            response.data.productCount || "unknown"
          }`
        );
      } else {
        setBackendStatus(`Backend responded with status ${response.status}`);
      }
    } catch (error: any) {
      console.error("Backend connection error:", error);
      setBackendStatus(
        `⚠️ Backend appears to be down (port 8081): ${error.message}`
      );
    }
  };

  const testBackendEndpoint = async () => {
    setBackendTestResult("Testing...");
    try {
      const response = await axios.get(backendTestUrl, {
        timeout: 5000,
        validateStatus: () => true,
      });
      console.log("Backend test response:", response);

      if (response.status >= 200 && response.status < 300) {
        setBackendTestResult(`✅ Success! Status: ${response.status}`);
        setLastSuccessfulResponse(response.data);
      } else {
        setBackendTestResult(`⚠️ Error ${response.status}`);
        setLastSuccessfulResponse(response.data || null);
      }
    } catch (error: any) {
      console.error("Backend test error:", error);
      setBackendTestResult(`❌ Network Error: ${error.message}`);
      setLastSuccessfulResponse(null);
    }
  };

  const testCors = async () => {
    setCorsTestResult("Testing...");
    try {
      // Use the dynamic hostname
      const endpoint = `http://${hostname}:8081/api/debug/test-cors`;
      const response = await axios.get(endpoint, {
        headers: {
          Origin: window.location.origin,
        },
        timeout: 5000,
        validateStatus: () => true,
      });
      console.log("CORS test response:", response);

      if (response.status >= 200 && response.status < 300) {
        setCorsTestResult(
          `Success! Server responded with: ${JSON.stringify(response.data)}`
        );
      } else {
        setCorsTestResult(
          `Error ${response.status}: ${JSON.stringify(
            response.data || "No data"
          )}`
        );
      }
    } catch (error: any) {
      console.error("CORS test error:", error);
      setCorsTestResult(`Network Error: ${error.message}`);
    }
  };

  const testHeaders = async () => {
    setHeaderTestResult("Testing...");
    try {
      const response = await axios.get(testEndpointUrl, {
        headers: {
          "X-Test-Header": "TestValue",
          "Content-Type": "application/json",
        },
        timeout: 5000,
        validateStatus: () => true,
      });
      console.log("Headers test response:", response);

      if (response.status >= 200 && response.status < 300) {
        setHeaderTestResult(response.data);
      } else {
        setHeaderTestResult(
          `Error ${response.status}: ${JSON.stringify(
            response.data || "No data"
          )}`
        );
      }
    } catch (error: any) {
      console.error("Headers test error:", error);
      setHeaderTestResult(`Network Error: ${error.message}`);
    }
  };

  const testNetworkConnection = async () => {
    setNetworkStatus("Testing connection...");
    try {
      const response = await axios.get(networkTestEndpoint, {
        timeout: 5000,
        // Important: use validateStatus to accept any status code
        validateStatus: () => true,
      });

      console.log("Network test response:", response);

      // We received a response with any status code
      if (response.status) {
        setNetworkStatus(
          `✅ Connection successful! Status: ${response.status}. The server responded with a ${response.status} status code.`
        );
      }
    } catch (error: any) {
      // This will only happen for network errors, not HTTP status errors
      console.error("Network test error:", error);
      if (error.code === "ECONNREFUSED") {
        setNetworkStatus(
          `❌ Connection refused (ECONNREFUSED). The server at ${networkTestEndpoint} is not accepting connections.`
        );
      } else if (error.code === "ECONNABORTED") {
        setNetworkStatus(
          `❌ Connection timeout (ECONNABORTED). The server at ${networkTestEndpoint} did not respond in time.`
        );
      } else {
        setNetworkStatus(
          `❌ Network Error: ${error.message} (${error.code || "unknown code"})`
        );
      }
    }
  };

  useEffect(() => {
    // Get the current hostname when component mounts
    if (typeof window !== "undefined") {
      const currentHostname = window.location.hostname;
      setHostname(currentHostname);
      setBackendUrl(`http://${currentHostname}:8081/api`);

      // Update all test URLs
      setBackendTestUrl(`http://${currentHostname}:8081/api/debug/health`);
      setNetworkTestEndpoint(
        `http://${currentHostname}:8081/api/debug/test-cors`
      );
      setTestEndpointUrl(`http://${currentHostname}:8081/api/debug/headers`);

      // Run initial tests with the correct hostname
      setTimeout(() => {
        checkBackendStatus();
        testNetworkConnection();
      }, 500);
    }

    // 1. Direct fetch with axios - Use dynamic hostname
    const fetchProducts = async () => {
      if (typeof window !== "undefined") {
        const host = window.location.hostname;
        try {
          const response = await axios({
            method: "get",
            url: `http://${host}:8081/api/products`,
            validateStatus: () => true,
            timeout: 5000,
          });

          console.log("Direct axios response:", response);
          if (response.status >= 200 && response.status < 300) {
            setDirectFetchResult(
              `Success! Found ${response.data.length} products.`
            );
          } else {
            setDirectFetchResult(
              `Error ${response.status}: ${JSON.stringify(
                response.data || "No data"
              )}`
            );
          }
          setStatusCode(response.status);
        } catch (error: any) {
          console.error("Direct fetch error:", error);
          setDirectFetchResult(
            `Network Error: ${error.message} (likely CORS or connection issue)`
          );
          setErrorMessage(error.message || null);
        }
      }
    };

    fetchProducts();

    // 2. Via API utility
    api
      .get("/products", { validateStatus: () => true })
      .then((response) => {
        console.log("API response:", response);
        if (response.status >= 200 && response.status < 300) {
          setApiFetchResult(`Success! Found ${response.data.length} products.`);
        } else {
          setApiFetchResult(
            `Error ${response.status}: ${JSON.stringify(
              response.data || "No data"
            )}`
          );
        }
      })
      .catch((error) => {
        console.error("API error:", error);
        setApiFetchResult(`Network Error: ${error.message}`);
      });

    // 3. Using our API utility with new response format
    productsApi.getAllProducts().then((result) => {
      console.log("API utility result:", result);
      if (result.success) {
        setApiUtilityResult(
          `Success! Found ${result.data?.length || 0} products.`
        );
      } else {
        setApiUtilityResult(
          `Error: ${result.error} ${result.status ? `(${result.status})` : ""}`
        );
      }
    });
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Debug Page</h1>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Network Connection Test</h2>
        <p className="mb-2">
          Test basic network connectivity to the backend server
        </p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={networkTestEndpoint}
            onChange={(e) => setNetworkTestEndpoint(e.target.value)}
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={testNetworkConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Connection
          </button>
        </div>
        <p
          className={`mb-4 font-medium ${
            networkStatus.includes("✅")
              ? "text-green-600"
              : networkStatus.includes("❌")
              ? "text-red-600"
              : ""
          }`}
        >
          {networkStatus}
        </p>
        <div className="mt-4 text-sm bg-gray-100 p-3 rounded">
          <p className="font-semibold">Common network errors:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>
              <span className="font-medium">ECONNREFUSED</span>: The server is
              not running or not accepting connections
            </li>
            <li>
              <span className="font-medium">ECONNABORTED</span>: The connection
              timed out
            </li>
            <li>
              <span className="font-medium">CORS error</span>: The server is
              running but doesn't allow cross-origin requests
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Backend Status</h2>
        <p
          className={`font-medium ${
            backendStatus.includes("down") ? "text-red-600" : "text-green-600"
          }`}
        >
          {backendStatus}
        </p>
        <div className="mt-4">
          <button
            onClick={checkBackendStatus}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check Again
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Direct Backend Test</h2>
        <p className="mb-2">
          Test any backend endpoint directly (useful for API debugging)
        </p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={backendTestUrl}
            onChange={(e) => setBackendTestUrl(e.target.value)}
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={testBackendEndpoint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Endpoint
          </button>
        </div>
        <p className="mb-4 font-medium">{backendTestResult}</p>
        {lastSuccessfulResponse && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Response Data:</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs">
              {JSON.stringify(lastSuccessfulResponse, null, 2)}
            </pre>
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <button
            onClick={() => {
              setBackendTestUrl(`http://${hostname}:8081/api/debug/health`);
              setTimeout(testBackendEndpoint, 100);
            }}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Health Check
          </button>
          <button
            onClick={() => {
              setBackendTestUrl(`http://${hostname}:8081/api/debug/headers`);
              setTimeout(testBackendEndpoint, 100);
            }}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Headers
          </button>
          <button
            onClick={() => {
              setBackendTestUrl(`http://${hostname}:8081/api/debug/test-cors`);
              setTimeout(testBackendEndpoint, 100);
            }}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            CORS Test
          </button>
          <button
            onClick={() => {
              setBackendTestUrl(
                `http://${hostname}:8081/api/debug/all-products-raw`
              );
              setTimeout(testBackendEndpoint, 100);
            }}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            All Products
          </button>
          <button
            onClick={() => {
              setBackendTestUrl(`http://${hostname}:8081/api/debug/categories`);
              setTimeout(testBackendEndpoint, 100);
            }}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Categories
          </button>
          <button
            onClick={() => {
              setBackendTestUrl(
                `http://${hostname}:8081/api/debug/add-test-product`
              );
              setTimeout(testBackendEndpoint, 100);
            }}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Add Test Product
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">CORS Test</h2>
        <p className="mb-2">
          Test if the backend server is properly configured for CORS
        </p>
        <p className="mb-4">{corsTestResult}</p>
        <button
          onClick={testCors}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test CORS
        </button>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Headers Test</h2>
        <p className="mb-2">
          Send a request to the server and check what headers are received
        </p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={testEndpointUrl}
            onChange={(e) => setTestEndpointUrl(e.target.value)}
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={testHeaders}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Headers
          </button>
        </div>
        {headerTestResult && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Response:</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs">
              {typeof headerTestResult === "object"
                ? JSON.stringify(headerTestResult, null, 2)
                : headerTestResult}
            </pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">1. Direct Axios Fetch</h2>
          <div className="text-sm">
            <p>
              <strong>URL:</strong> http://{hostname}:8081/api/products
            </p>
            <p>
              <strong>Result:</strong> {directFetchResult}
            </p>
            {statusCode && (
              <p className="mt-2">
                <strong>Status Code:</strong> {statusCode}
              </p>
            )}
            {errorMessage && (
              <p className="mt-2">
                <strong>Error Message:</strong> {errorMessage}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">2. Next.js API Proxy</h2>
          <div className="text-sm">
            <p>
              <strong>URL:</strong> /api/products
            </p>
            <p>
              <strong>Result:</strong> {apiFetchResult}
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">3. API Utility</h2>
          <div className="text-sm">
            <p>
              <strong>Function:</strong> productsApi.getAllProducts()
            </p>
            <p>
              <strong>Result:</strong> {apiUtilityResult}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        <div className="text-sm space-y-2">
          <p>
            <strong>Frontend Address:</strong> http://{hostname}:3000
          </p>
          <p>
            <strong>Backend URL:</strong> {backendUrl}
          </p>
          <p className="mt-2 text-yellow-600">
            <strong>Note:</strong> API URLs now use the current hostname (
            {hostname}) instead of localhost to ensure network access works
            correctly.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
