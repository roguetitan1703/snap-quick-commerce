import { Product } from "@/types";
import { BACKEND_URL } from "./config";

/**
 * Fetches a list of all products
 * @param category Optional category filter
 * @param search Optional search term
 * @returns Array of products
 */
export async function getProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    let url = `${BACKEND_URL}/api/products`;
    const params = new URLSearchParams();
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetches detailed information for a specific product
 * @param id The product ID
 * @returns Product details or null if not found
 */
export async function getProductDetails(id: number): Promise<Product> {
  const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches a list of all available product categories
 * @returns Array of category names
 */
export async function getProductCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
} 