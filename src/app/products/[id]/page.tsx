"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";
import { RecommendationsPopup } from "@/components/products/RecommendationsPopup";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id ? parseInt(params.id as string) : 0;
  const { product, loading, error, refetch } = useProduct(productId);
  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    fetchRecommendations,
  } = useRecommendations();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [showRecommendationsPopup, setShowRecommendationsPopup] =
    useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, product, 1);
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
    if (product) {
      await fetchRecommendations(product.id);
      setShowRecommendationsPopup(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="mt-2 text-gray-600">Failed to load product details.</p>
          <button
            onClick={refetch}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddToCart}
              className="rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500"
            >
              Add to cart
            </button>
            <button
              onClick={handleShowRecommendations}
              className="text-indigo-600 hover:text-indigo-500"
            >
              View similar products
            </button>
          </div>
        </div>
      </div>
      <RecommendationsPopup
        isOpen={showRecommendationsPopup}
        onClose={() => setShowRecommendationsPopup(false)}
        recommendations={recommendations}
        currentProduct={product}
      />
    </div>
  );
}
