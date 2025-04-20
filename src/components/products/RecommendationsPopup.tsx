"use client";

import React from "react";
import { Product } from "@/hooks/useProducts";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";

interface RecommendationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: Product[];
  currentProduct: Product;
}

export function RecommendationsPopup({
  isOpen,
  onClose,
  recommendations,
  currentProduct,
}: RecommendationsPopupProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (product: Product) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customers who bought this also bought</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {recommendations.map((product) => (
            <div key={product.productId} className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Link
                  href={`/products/${product.productId}`}
                  className="text-sm font-medium hover:underline"
                >
                  {product.name}
                </Link>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.discountPercent > 0 && (
                    <p className="text-sm text-green-600">
                      {product.discountPercent}% off
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
