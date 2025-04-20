// Base URL for API requests
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// Recommendation service URL
export const RECOMMENDATION_URL = process.env.NEXT_PUBLIC_RECOMMENDATION_URL || "http://localhost:5000";

// Default pagination limit
export const DEFAULT_LIMIT = 10;

// Feature flags
export const FEATURES = {
  // Enable recommendation system
  enableRecommendations: true,
  
  // Enable user personalization
  enablePersonalization: true,
  
  // Enable real-time inventory updates
  enableRealTimeInventory: false,
}; 