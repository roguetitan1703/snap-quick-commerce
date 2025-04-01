"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getFallbackImage } from "@/utils/productImageMap";

/**
 * ImprovedImage component with better error handling to prevent continuous refetching
 * Uses React state to track errors and prevent unnecessary network requests for failed images
 */
export const ImprovedImage = ({
  src,
  alt,
  productName,
  ...props
}: {
  src: string;
  alt: string;
  productName?: string;
  [key: string]: any;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  // Generate fallback SVG path based on product name or image path
  const getFallback = () => {
    if (productName) {
      return getFallbackImage(productName);
    }

    // Extract the filename from the path to try matching a product
    const filename = src.split("/").pop()?.split(".")[0] || "";

    // Try to determine product name from filename
    const formattedName = filename
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Check if we have a mapping for this name
    if (formattedName) {
      const fallback = getFallbackImage(formattedName);
      if (fallback !== "/images/placeholder-product.svg") {
        return fallback;
      }
    }

    // Default fallback
    return "/images/placeholder-product.svg";
  };

  return (
    <Image
      {...props}
      src={!error ? imgSrc : getFallback()}
      alt={alt}
      onError={(e) => {
        // Prevent continuous retries
        if (!error) {
          console.error(`Failed to load image: ${imgSrc}`);
          setError(true);
          setImgSrc(getFallback());
        }
      }}
    />
  );
};

export default ImprovedImage;
