"use client";

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { cartApi } from '@/utils/api';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProduct(productId: number): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getProduct(productId);
      if (response.success && response.data) {
        // Map the API product to our Product type
        const mappedProduct: Product = {
          id: response.data.productId,
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          category: response.data.category,
          imageUrl: response.data.imageUrl,
          currentStock: response.data.currentStock,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        setProduct(mappedProduct);
      } else {
        setError(response.error || 'Failed to fetch product');
      }
    } catch (err) {
      setError('An error occurred while fetching the product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId > 0) {
      fetchProduct();
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
} 