"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getFallbackImage, productImageMap } from "@/utils/productImageMap";

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
    // If product name is provided directly, use it first
    if (productName) {
      return getFallbackImage(productName);
    }

    // Extract the filename from the path to try matching a product
    const filename = src.split("/").pop()?.split(".")[0] || "";

    // Check if the filename exactly matches a key in our SVG map
    const svgPath = `/images/products/${filename}.svg`;
    if (Object.values(productImageMap).includes(svgPath)) {
      return svgPath;
    }

    // Try to determine product name from filename by formatting it
    const formattedName = filename
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Check if we have a mapping for this formatted name
    if (formattedName) {
      const fallback = getFallbackImage(formattedName);
      if (fallback !== "/images/placeholder-product.svg") {
        return fallback;
      }
    }

    // Try to extract product name from alt text if it's descriptive
    if (alt && alt.length > 3 && !alt.toLowerCase().includes("product")) {
      const altFallback = getFallbackImage(alt);
      if (altFallback !== "/images/placeholder-product.svg") {
        return altFallback;
      }
    }

    // Try using the SVG with the same name as the original image
    if (filename && !src.endsWith(".svg")) {
      // Just replace the extension directly
      return src.replace(/\.(jpg|jpeg|png)$/i, ".svg");
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
