"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

interface ProductQuantityProps {
  product: Product;
  redirectToLogin?: boolean;
}

export default function ProductQuantity({
  product,
  redirectToLogin = false,
}: ProductQuantityProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const increaseQuantity = () => {
    if (quantity < product.currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (redirectToLogin) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={increaseQuantity}
          disabled={quantity >= product.currentStock}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground ml-2">
          {product.currentStock} available
        </span>
      </div>

      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={product.currentStock === 0 || isAddingToCart}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isAddingToCart
          ? "Adding..."
          : product.currentStock === 0
          ? "Out of Stock"
          : "Add to Cart"}
      </Button>
    </div>
  );
}
