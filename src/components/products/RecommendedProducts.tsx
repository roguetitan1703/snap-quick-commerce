import React from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";
import { FiThumbsUp, FiInfo } from "react-icons/fi";

interface RecommendedProductsProps {
  products: Product[];
  className?: string;
  title?: string;
  showExplanation?: boolean;
}

export default function RecommendedProducts({
  products,
  className,
  title = "Recommended Products",
  showExplanation = true,
}: RecommendedProductsProps) {
  if (!products.length) return null;

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          {showExplanation && (
            <div className="ml-2 text-gray-500 text-sm flex items-center">
              <FiThumbsUp className="mr-1" size={14} />
              <span>Based on shopping patterns</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-start text-sm text-gray-600">
          <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
          <p>
            Customers who viewed this item also purchased the products below.
            Our recommendation system analyzes shopping patterns to suggest
            items you might be interested in.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="compact"
            hideActions={false}
            className="border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
          />
        ))}
      </div>
    </div>
  );
}
