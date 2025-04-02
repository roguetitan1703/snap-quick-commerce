import { useState, useEffect } from 'react';
import { productsApi } from '@/utils/api';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  currentStock: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: (category?: string, search?: string) => void;
}

export function useProducts(initialCategory?: string, initialSearch?: string): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [search, setSearch] = useState<string | undefined>(initialSearch);

  const fetchProducts = async (category?: string, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (category !== undefined) setCategory(category);
      if (search !== undefined) setSearch(search);
      
      const response = await productsApi.getAllProducts(category, search);
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        console.error('Error fetching products:', response.error);
        setError(response.error || 'Failed to fetch products. Please try again later.');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error in useProducts hook:', err);
      setError('Failed to fetch products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(category, search);
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
}

export function useProduct(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApi.getProductById(productId);
      
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        console.error(`Error fetching product with ID ${productId}:`, response.error);
        setError(response.error || 'Failed to fetch product details. Please try again later.');
        setProduct(null);
      }
    } catch (err) {
      console.error(`Error in useProduct hook for ID ${productId}:`, err);
      setError('Failed to fetch product details. Please try again later.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
} 