"use client";

import React, { useState } from "react";
import { Product } from "@/hooks/useProducts";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";
import { RecommendationsPopup } from "./RecommendationsPopup";
import { useRecommendations } from "@/hooks/useRecommendations";

interface ProductCardProps {
  product: Product;
  showRecommendations?: boolean;
}

export function ProductCard({
  product,
  showRecommendations = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [showRecommendationsPopup, setShowRecommendationsPopup] =
    useState(false);
  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    fetchRecommendations,
  } = useRecommendations();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.productId, product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShowRecommendations = async () => {
    if (showRecommendations) {
      await fetchRecommendations(product.productId);
      setShowRecommendationsPopup(true);
    }
  };

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.productId}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Category ID: {product.categoryId}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.discountPercent > 0 && (
            <p className="text-sm text-green-600">
              {product.discountPercent}% off
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleAddToCart}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add to cart
        </button>
      </div>
      {showRecommendations && (
        <div className="mt-2">
          <button
            onClick={handleShowRecommendations}
            className="w-full text-sm text-indigo-600 hover:text-indigo-500"
          >
            View similar products
          </button>
        </div>
      )}
      <RecommendationsPopup
        isOpen={showRecommendationsPopup}
        onClose={() => setShowRecommendationsPopup(false)}
        recommendations={recommendations}
        currentProduct={product}
      />
    </div>
  );
}
