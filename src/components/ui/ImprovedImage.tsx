"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getFallbackImage, productImageMap } from "@/utils/productImageMap";

interface ImprovedImageProps {
  src: string;
  alt: string;
  productName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  fallbackStyles?: string;
  fallbackContent?: React.ReactNode;
  [key: string]: any;
}

/**
 * ImprovedImage component with better error handling to prevent continuous refetching
 * Uses React state to track errors and prevent unnecessary network requests for failed images
 */
export const ImprovedImage = ({
  src,
  alt,
  productName,
  width: propWidth,
  height: propHeight,
  fill,
  fallbackStyles,
  fallbackContent,
  ...props
}: ImprovedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  // Check if the image is an SVG
  const isSvg = imgSrc.endsWith(".svg");

  // Default dimensions for SVG images if not provided (only set if fill is not true)
  const width = fill ? undefined : propWidth || (isSvg ? 500 : undefined);
  const height = fill ? undefined : propHeight || (isSvg ? 500 : undefined);

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

  // If there's an error and we have custom fallback content, show that instead of the Image
  if (error && fallbackContent) {
    return (
      <div
        className={
          fallbackStyles || "bg-gray-200 flex items-center justify-center"
        }
      >
        {fallbackContent}
      </div>
    );
  }

  // Otherwise render the Next.js Image component with appropriate props
  // Don't pass both width/height and fill simultaneously
  return (
    <Image
      {...props}
      src={!error ? imgSrc : getFallback()}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
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
