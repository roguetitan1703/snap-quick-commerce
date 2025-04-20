import { useState, useEffect } from 'react';
import { productsApi } from '@/utils/api';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  discountPercent: number;
  createdAt: string;
  isActive: boolean;
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

  const fetchProducts = async (fetchCategory?: string, fetchSearch?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use local variables for the API call, don't update state here
      const categoryToUse = fetchCategory !== undefined ? fetchCategory : category;
      const searchToUse = fetchSearch !== undefined ? fetchSearch : search;
      
      console.log('Fetching products with:', { categoryToUse, searchToUse });
      const response = await productsApi.getAllProducts(categoryToUse, searchToUse);
      
      if (response.success && response.data) {
        setProducts(Array.isArray(response.data) ? response.data : []);
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

  const refetch = (newCategory?: string, newSearch?: string) => {
    console.log('Products refetch called with:', { newCategory, newSearch });
    
    // Update the state variables if new values are provided
    if (newCategory !== undefined) {
      console.log('Setting new category:', newCategory);
      setCategory(newCategory);
    }
    
    if (newSearch !== undefined) {
      console.log('Setting new search:', newSearch);
      setSearch(newSearch);
    }
    
    // Fetch immediately with the new values
    console.log('Fetching products immediately');
    fetchProducts(newCategory, newSearch);
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []); // Only run once on mount

  // Handle filter changes
  useEffect(() => {
    if (category !== undefined || search !== undefined) {
      fetchProducts();
    }
  }, [category, search]); // Run when filters change

  return {
    products,
    loading,
    error,
    refetch
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