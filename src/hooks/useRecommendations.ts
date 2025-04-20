"use client";

import { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { cartApi } from '@/utils/api';

interface UseRecommendationsResult {
  recommendations: Product[];
  loading: boolean;
  error: string | null;
  fetchRecommendations: (productId?: number) => Promise<void>;
}

export function useRecommendations(): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (productId?: number) => {
    try {
      setLoading(true);
      setError(null);

      // Call the backend API to get recommendations based on Apriori algorithm
      const response = await cartApi.getRecommendations(productId);
      
      if (response.success) {
        // Transform the API response to match our Product interface
        const transformedRecommendations: Product[] = (response.data || []).map((item: any) => ({
          productId: item.productId || 0,
          name: item.name || 'Unknown Product',
          description: item.description || '',
          price: item.price || 0,
          categoryId: item.categoryId || 0,
          imageUrl: item.imageUrl || '/placeholder-product.jpg',
          discountPercent: item.discountPercent || 0,
          createdAt: item.createdAt || new Date().toISOString(),
          isActive: item.isActive ?? true
        }));
        setRecommendations(transformedRecommendations);
      } else {
        throw new Error(response.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations
  };
} 