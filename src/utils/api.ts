import axios from 'axios';

// Get the correct hostname based on where the app is running
const getBaseUrl = () => {
  // When running in the browser
  if (typeof window !== 'undefined') {
    // For development, use the backend server port
    // Make sure this matches the port in your application.properties
    const port = '8082';
    
    // This will work regardless of whether we're on localhost or a network IP
    return `http://${window.location.hostname}:${port}/api`;
  }
  // Default fallback when running on server
  return 'http://localhost:8082/api';
};

// API base URL
export const API_BASE_URL = getBaseUrl();

// Type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
  status?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  userId: number;
  username: string;
  email: string;
}

export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  imageUrl: string;
  discountPercent: number;
  createdAt: string;
  isActive: boolean;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  cartId: number;
  userId: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
// In src/utils/api.ts
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: () => true,
  withCredentials: false
});

// Add more detailed request logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Debug Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      params: config.params,
      baseURL: config.baseURL,
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`
    });
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Debug Request error:', error, {
      message: error.message,
      code: error.code,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Add more detailed response logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Debug Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      config: {
        url: response.config.url,
        baseURL: response.config.baseURL,
        method: response.config.method
      }
    });
    return response;
  },
  (error) => {
    // This should only happen for network errors, not HTTP status errors
    console.error('❌ Debug Network error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      config: error.config ? {
        url: error.config.url,
        baseURL: error.config.baseURL,
        method: error.config.method
      } : 'No config available'
    });
    return Promise.reject(error);
  }
);

// Helper functions for API response handling
const handleApiResponse = <T>(response: any): ApiResponse<T> => {
  if (response.status >= 200 && response.status < 300) {
    return {
      success: true,
      data: response.data,
      error: undefined
    };
  } else {
    return {
      success: false,
      data: null,
      error: response.data || 'Request failed',
      status: response.status
    };
  }
};

const handleApiError = <T>(error: any): ApiResponse<T> => {
  console.error('API error:', error);
  return {
    success: false,
    data: null,
    error: error.response?.data || 'Cannot connect to the server. Please try again later.'
  };
};

// Auth API services
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await api.post('/auth/login', { username: email, password });
      return handleApiResponse<LoginResponse>(response);
    } catch (error: any) {
      return handleApiError<LoginResponse>(error);
    }
  },
  register: async (username: string, password: string, email: string) => {
    return handleApiResponse(api.post('/auth/register', { username, password, email }));
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};

// Products API services
export const productsApi = {
  getAllProducts: async (category?: string, search?: string): Promise<ApiResponse<Product[]>> => {
    try {
      // Build query parameters
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      console.log('Fetching products with params:', params);
      
      const response = await api.get('/products', { params });
      
      // Since validateStatus allows all status codes, we need to check the status code manually
      if (response.status >= 200 && response.status < 300) {
        // Ensure we're returning an array
        const products = Array.isArray(response.data) ? response.data : [];
        return {
          success: true,
          data: products,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: `Error fetching products (${response.status})`,
          status: response.status,
          data: []
        };
      }
    } catch (error: any) {
      // This will only be network errors now, not HTTP status errors
      console.error('Error in getAllProducts:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch products',
        data: []
      };
    }
  },
  
  getProductById: async (id: number): Promise<ApiResponse<Product>> => {
    try {
      const response = await api.get(`/products/${id}`);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: response.data,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: `Error fetching product (${response.status})`,
          status: response.status,
          data: null
        };
      }
    } catch (error: any) {
      console.error(`Error in getProductById(${id}):`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch product',
        data: null
      };
    }
  },

  createProduct: async (productData: any) => {
    return handleApiResponse(api.post('/products', productData));
  },
  
  updateProduct: async (id: number, productData: any) => {
    return handleApiResponse(api.put(`/products/${id}`, productData));
  },
  
  deleteProduct: async (id: number) => {
    return handleApiResponse(api.delete(`/products/${id}`));
  }
};

// Cart API services
export const cartApi = {
  getCart: () => handleApiResponse<Cart>(api.get('/cart')),
  getCartTotal: () => handleApiResponse(api.get('/cart/total')),
  addToCart: (productId: number, quantity: number = 1) => handleApiResponse(api.post('/cart/items', { productId, quantity })),
  updateCartItem: (itemId: number, quantity: number) => handleApiResponse(api.put(`/cart/items/${itemId}`, { quantity })),
  removeCartItem: (itemId: number) => handleApiResponse(api.delete(`/cart/items/${itemId}`)),
  clearCart: () => handleApiResponse(api.delete('/cart')),
  getRecommendations: async (productId?: number): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await api.get(`/recommendations${productId ? `/${productId}` : ''}`);
      if (response.status >= 200 && response.status < 300) {
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
        return {
          success: true,
          data: transformedRecommendations,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: `Error fetching recommendations (${response.status})`,
          status: response.status,
          data: []
        };
      }
    } catch (error: any) {
      console.error('Error in getRecommendations:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch recommendations',
        data: []
      };
    }
  },
  getProduct: async (productId: number): Promise<ApiResponse<Product>> => {
    try {
      const response = await api.get(`/products/${productId}`);
      if (response.status >= 200 && response.status < 300) {
        // Transform the API response to match our Product interface
        const transformedProduct: Product = {
          productId: response.data.productId || 0,
          name: response.data.name || 'Unknown Product',
          description: response.data.description || '',
          price: response.data.price || 0,
          categoryId: response.data.categoryId || 0,
          imageUrl: response.data.imageUrl || '/placeholder-product.jpg',
          discountPercent: response.data.discountPercent || 0,
          createdAt: response.data.createdAt || new Date().toISOString(),
          isActive: response.data.isActive ?? true
        };
        return {
          success: true,
          data: transformedProduct,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: `Error fetching product (${response.status})`,
          status: response.status,
          data: null
        };
      }
    } catch (error: any) {
      console.error(`Error in getProduct(${productId}):`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch product',
        data: null
      };
    }
  }
};

// Orders API services
export const ordersApi = {
  getOrders: async () => {
    return handleApiResponse(api.get('/orders'));
  },
  getOrderById: async (id: number) => {
    return handleApiResponse(api.get(`/orders/${id}`));
  },
  placeOrder: async () => {
    return handleApiResponse(api.post('/orders'));
  },
  updateOrderStatus: async (id: number, status: string) => {
    return handleApiResponse(api.put(`/orders/${id}`, { status }));
  },
};

// Inventory API services (admin only)
export const inventoryApi = {
  getInventory: async () => {
    return handleApiResponse(api.get('/inventory'));
  },
  getLowStock: async (threshold?: number) => {
    const params = new URLSearchParams();
    if (threshold) params.append('threshold', threshold.toString());
    return handleApiResponse(api.get('/inventory/low-stock', { params }));
  },
  updateStock: async (productId: number, currentStock: number) => {
    return handleApiResponse(api.put(`/inventory/${productId}`, { currentStock }));
  },
};

// Predictions and Recommendations API services
export const predictionsApi = {
  getPredictions: async (productId?: number, category?: string) => {
    const params = new URLSearchParams();
    if (productId) params.append('productId', productId.toString());
    if (category) params.append('category', category);
    return handleApiResponse(api.get('/predictions', { params }));
  },
  getRecommendations: async (productId: number) => {
    return handleApiResponse(api.get('/recommendations', { params: { productId } }));
  },
};

export default api;