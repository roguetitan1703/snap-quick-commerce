import { Product } from "@/types";
import { BACKEND_URL } from "./config";

// Simple in-memory cache to avoid excessive API calls
const recommendationCache = new Map<number, {products: Product[], timestamp: number}>();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

// Interface for API response products which may have different property names
interface ApiProduct {
  productId?: number;
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  currentStock: number;
}

// Hardcoded product associations for MVP demo
// These override API responses to guarantee we have some recommendations
const HARDCODED_RECOMMENDATIONS: Record<number, number[]> = {
  // Milk → Eggs, Bread, Cereal
  1: [2, 3, 8],
  // Eggs → Milk, Bread, Butter
  2: [1, 3, 6],
  // Bread → Butter, Jam, Milk
  3: [6, 4, 1],
  // Jam → Bread, Butter, Peanut Butter
  4: [3, 6, 5],
  // Peanut Butter → Bread, Jam
  5: [3, 4],
  // Butter → Bread, Eggs
  6: [3, 2],
  // Soft Drink → Chips, Snacks
  7: [10, 11],
  // Cereal → Milk, Fruits
  8: [1, 9],
  // Fruits → Yogurt, Cereal
  9: [12, 8],
  // Chips → Soft Drink, Dip
  10: [7, 13],
  // Snacks → Soft Drink
  11: [7],
  // Yogurt → Fruits, Granola
  12: [9, 14],
  // Dip → Chips, Crackers
  13: [10, 15],
  // Granola → Yogurt, Milk
  14: [12, 1],
  // Crackers → Cheese, Dip
  15: [16, 13],
  // Cheese → Crackers, Wine
  16: [15, 17],
  // Wine → Cheese
  17: [16]
};

// Maps product IDs to names for easier reference in development
const PRODUCT_NAME_LOOKUP: Record<number, string> = {
  1: "Milk",
  2: "Eggs",
  3: "Bread",
  4: "Jam",
  5: "Peanut Butter",
  6: "Butter",
  7: "Soft Drink",
  8: "Cereal",
  9: "Fruits",
  10: "Chips",
  11: "Snacks",
  12: "Yogurt",
  13: "Dip",
  14: "Granola",
  15: "Crackers",
  16: "Cheese",
  17: "Wine"
};

// Convert API product format to frontend Product format
function normalizeProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id || apiProduct.productId || 0,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    category: apiProduct.category,
    imageUrl: apiProduct.imageUrl,
    currentStock: apiProduct.currentStock
  };
}

// Get product ID regardless of whether it's id or productId
function getProductId(product: ApiProduct): number {
  return product.id || product.productId || 0;
}

/**
 * Fetches recommended products based on a product ID using Apriori algorithm results
 * @param productId The ID of the product to get recommendations for
 * @param limit Optional number of recommendations to return
 * @returns Array of recommended products
 */
export async function getRecommendedProducts(productId: number, limit: number = 4): Promise<Product[]> {
  console.log(`Getting recommendations for product ${productId}`);
  
  // Check cache first
  const cacheKey = productId;
  const cached = recommendationCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
    console.log('Using cached recommendations');
    return cached.products.slice(0, limit);
  }
  
  try {
    let recommendedApiProducts: ApiProduct[] = [];
    
    // Try to get all products first
    const allApiProducts = await getAllProducts();
    
    // Check if we have hardcoded recommendations for this product
    const hardcodedIds = HARDCODED_RECOMMENDATIONS[productId] || [];
    
    if (hardcodedIds.length > 0) {
      console.log(`Using hardcoded recommendations for product ${productId}: ${hardcodedIds.join(', ')}`);
      
      // Map the IDs to actual products
      recommendedApiProducts = hardcodedIds
        .map(id => allApiProducts.find(p => getProductId(p) === id))
        .filter(p => p !== undefined) as ApiProduct[];
      
      console.log(`Found ${recommendedApiProducts.length} hardcoded product matches`);
    }
    
    // If we don't have enough hardcoded recommendations, try the API
    if (recommendedApiProducts.length < limit) {
      try {
        console.log('Falling back to recommendation API');
        const apiUrl = `${BACKEND_URL}/api/recommendations/product/${productId}?limit=${limit}`;
        console.log(`Fetching from: ${apiUrl}`);
        
        const headers: Record<string, string> = {};
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(apiUrl, { 
          headers, 
          // Add a timeout to prevent long-hanging requests
          signal: AbortSignal.timeout(3000) 
        });
        
        if (response.ok) {
          const apiRecommendations: ApiProduct[] = await response.json();
          console.log('API returned recommendations:', apiRecommendations);
          
          // Add any new recommendations from the API that aren't already in our list
          const existingIds = new Set(recommendedApiProducts.map(getProductId));
          
          for (const rec of apiRecommendations) {
            const recId = getProductId(rec);
            if (!existingIds.has(recId) && recommendedApiProducts.length < limit) {
              recommendedApiProducts.push(rec);
              existingIds.add(recId);
            }
          }
        } else {
          console.warn(`API returned error: ${response.status} ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn('Error fetching from recommendation API:', apiError);
      }
    }
    
    // If we still don't have enough recommendations, add random products
    if (recommendedApiProducts.length < limit) {
      console.log('Adding random product recommendations to fill quota');
      
      // Get products that aren't already in our recommendations and aren't the current product
      const availableProducts = allApiProducts.filter(p => 
        getProductId(p) !== productId && 
        !recommendedApiProducts.some(r => getProductId(r) === getProductId(p))
      );
      
      // Shuffle and take what we need
      const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
      const randomRecs = shuffled.slice(0, limit - recommendedApiProducts.length);
      
      recommendedApiProducts = [...recommendedApiProducts, ...randomRecs];
    }
    
    // Convert API products to the frontend Product format
    const normalizedProducts = recommendedApiProducts.map(normalizeProduct);
    
    // Cache the results
    recommendationCache.set(cacheKey, {
      products: normalizedProducts,
      timestamp: Date.now()
    });
    
    return normalizedProducts.slice(0, limit);
  } catch (error) {
    console.error("Error in recommendation system:", error);
    return [];
  }
}

/**
 * Fetches personalized recommendations for a specific user
 * @param userId The ID of the user to get recommendations for
 * @param limit Optional number of recommendations to return
 * @returns Array of recommended products
 */
export async function getUserRecommendations(userId: number, limit: number = 4): Promise<Product[]> {
  try {
    console.log(`Getting user recommendations for user ${userId}`);
    const cacheKey = -userId; // Negative to distinguish from product recommendations
    
    // Check cache
    const cached = recommendationCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
      console.log('Using cached user recommendations');
      return cached.products.slice(0, limit);
    }
    
    // Try API first
    try {
      const apiUrl = `${BACKEND_URL}/api/recommendations/user/${userId}?limit=${limit}`;
      console.log(`Fetching from: ${apiUrl}`);
      
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(apiUrl, { 
        headers,
        signal: AbortSignal.timeout(3000) 
      });
      
      if (response.ok) {
        const apiRecommendations: ApiProduct[] = await response.json();
        console.log('API returned user recommendations:', apiRecommendations);
        
        const normalizedProducts = apiRecommendations.map(normalizeProduct);
        
        recommendationCache.set(cacheKey, {
          products: normalizedProducts,
          timestamp: Date.now()
        });
        
        return normalizedProducts;
      }
    } catch (apiError) {
      console.warn('Error fetching from user recommendation API:', apiError);
    }
    
    // Fallback: return popular products
    const allApiProducts = await getAllProducts();
    const shuffledProducts = [...allApiProducts].sort(() => 0.5 - Math.random());
    const popularProducts = shuffledProducts.slice(0, limit).map(normalizeProduct);
    
    recommendationCache.set(cacheKey, {
      products: popularProducts,
      timestamp: Date.now()
    });
    
    return popularProducts;
  } catch (error) {
    console.error("Error in user recommendation system:", error);
    return [];
  }
}

// Helper function to get all products
async function getAllProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${BACKEND_URL}/api/products`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return await response.json();
}

// Helper function to get auth headers
function getAuthHeader() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
} 