import axios from 'axios';

// Get the correct hostname based on where the app is running
const getBaseUrl = () => {
  // When running in the browser
  if (typeof window !== 'undefined') {
    // Use current hostname - this will be 192.168.109.120 when accessed from network
    const hostname = window.location.hostname;
    return `http://${hostname}:8081/api`;
  }
  // Default fallback when running on server
  return 'http://localhost:8081/api';
};

// API base URL - supports both localhost and network IP access
export const API_BASE_URL = getBaseUrl();

// Type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
  status?: number;
}

export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
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

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Accept all status codes and prevent axios from throwing errors on non-2xx responses
  validateStatus: () => true,
  // Disable credentials for CORS to allow * origins
  withCredentials: false,
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
    const token = localStorage.getItem('token');
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

// Generic API response handler
const handleApiResponse = async <T>(apiCall: Promise<any>): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall;
    
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
        error: response.data?.message || `Error: ${response.status}`,
        status: response.status
      };
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'An unexpected error occurred',
    };
  }
};

// Auth API services
export const authApi = {
  login: async (username: string, password: string) => {
    return handleApiResponse(api.post('/auth/login', { username, password }));
  },
  register: async (username: string, password: string) => {
    return handleApiResponse(api.post('/auth/register', { username, password }));
  },
  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// Products API services
export const productsApi = {
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await api.get('/products');
      
      // Since validateStatus allows all status codes, we need to check the status code manually
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: response.data,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: `Error fetching products (${response.status})`,
          status: response.status,
          data: null
        };
      }
    } catch (error: any) {
      // This will only be network errors now, not HTTP status errors
      console.error('Error in getAllProducts:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch products',
        data: null
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
  getCart: async (): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.get('/cart');
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: response.data,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: `Error fetching cart (${response.status})`,
          status: response.status,
          data: null
        };
      }
    } catch (error: any) {
      console.error('Error in getCart:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch cart',
        data: null
      };
    }
  },
  
  getCartTotal: async () => {
    return handleApiResponse(api.get('/cart/total'));
  },
  
  addToCart: async (productId: number, quantity = 1): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.post('/cart/items', { productId, quantity });
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: response.data,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: `Error adding to cart (${response.status})`,
          status: response.status,
          data: null
        };
      }
    } catch (error: any) {
      console.error('Error in addToCart:', error);
      return {
        success: false,
        error: error.message || 'Failed to add to cart',
        data: null
      };
    }
  },
  
  updateCartItem: async (itemId: number, quantity: number) => {
    return handleApiResponse(api.put(`/cart/${itemId}`, { quantity }));
  },
  
  removeCartItem: async (itemId: number) => {
    return handleApiResponse(api.delete(`/cart/${itemId}`));
  },
  
  clearCart: async () => {
    return handleApiResponse(api.delete('/cart'));
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