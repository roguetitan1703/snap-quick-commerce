import { useState, useEffect } from 'react';
import { cartApi } from '@/utils/api';
import { useAuth } from './useAuth';
import { getLocalImagePath } from '@/utils/productImageMap';
import { Product } from './useProducts';

// Local storage key for cart data
const CART_STORAGE_KEY = 'snap-quick-commerce-cart';

// Export interfaces so they can be imported elsewhere
export interface CartItem {
  itemId: number | string;
  product: Product;
  quantity: number;
  maxQuantity?: number;
}

interface CartTotal {
  totalItems: number;
  totalAmount: number;
}

interface UseCartResult {
  cartItems: CartItem[];
  cartTotal: CartTotal;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, product: Product, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number | string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number | string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
  fetchCart: () => Promise<void>;
}

export function useCart(): UseCartResult {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<CartTotal>({ totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Calculate cart totals from items
  const calculateCartTotals = (items: CartItem[]): CartTotal => {
    return {
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: items.reduce((total, item) => {
        const price = item.product.price;
        const discount = item.product.discountPercent || 0;
        const discountedPrice = price * (1 - discount / 100);
        return total + (discountedPrice * item.quantity);
      }, 0)
    };
  };

  // Load cart from local storage
  const loadLocalCart = (): CartItem[] => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (err) {
      console.error('Error loading cart from local storage:', err);
      return [];
    }
  };

  // Save cart to local storage
  const saveLocalCart = (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to local storage:', err);
    }
  };

  // Fetch cart data when user authentication status changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user]);

  // Fetch cart from API with retry logic
  const fetchCart = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user) {
        console.log('Fetching cart from API...');
        
        // Fetch cart items from API
        const cartResponse = await cartApi.getCart();
        
        // Handle API error responses
        if (!cartResponse.success) {
          console.error('Cart API error:', cartResponse.error);
          if (retryCount < 2) {
            // Wait before retrying (backoff strategy)
            console.log(`Retrying cart fetch (${retryCount + 1}/2) in 1 second...`);
            setTimeout(() => fetchCart(retryCount + 1), 1000);
            return;
          } else {
            throw new Error(cartResponse.error || 'Failed to fetch cart data');
          }
        }
        
        // Transform the API response to match our CartItem interface
        if (!Array.isArray(cartResponse.data?.items)) {
          console.warn('Cart data is not an array:', cartResponse.data);
          setCartItems([]);
          setCartTotal({ totalItems: 0, totalAmount: 0 });
          setLoading(false);
          return;
        }
        
        const transformedCartItems: CartItem[] = cartResponse.data.items.map((item: any) => ({
          itemId: item.cartItemId || `backend-${Date.now()}`,
          product: {
            productId: item.product.productId || 0,
            name: item.product.name || 'Unknown Product',
            description: item.product.description || '',
            price: item.product.price || 0,
            categoryId: item.product.categoryId || 0,
            imageUrl: item.product.imageUrl || '/placeholder-product.jpg',
            discountPercent: item.product.discountPercent || 0,
            createdAt: item.product.createdAt || new Date().toISOString(),
            isActive: item.product.isActive ?? true
          },
          quantity: item.quantity || 1,
          maxQuantity: 99 // Default
        }));
        
        // Filter out invalid items
        const validCartItems = transformedCartItems.filter(item => 
          item && item.product && item.product.productId && 
          typeof item.product.price === 'number' && item.product.price > 0
        );
        
        setCartItems(validCartItems);
        setCartTotal(calculateCartTotals(validCartItems));
      } else {
        // Load cart from local storage when not authenticated
        const localCart = loadLocalCart();
        setCartItems(localCart);
        setCartTotal(calculateCartTotals(localCart));
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart. Please try again later.');
      
      // Set empty cart as fallback
      setCartItems([]);
      setCartTotal({ totalItems: 0, totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: number, product: Product, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user) {
        // Add to cart via API when authenticated
        const response = await cartApi.addToCart(productId, quantity);
        if (!response.success) {
          throw new Error(response.error || 'Failed to add item to cart');
        }
        await fetchCart();
      } else {
        // Add to local cart when not authenticated
        const localCart = loadLocalCart();
        
        // Process product image to use local paths when available
        const processedProduct = {
          ...product,
          imageUrl: getLocalImagePath(product.name, product.imageUrl)
        };
        
        // Check if item already exists in cart
        const existingItemIndex = localCart.findIndex(
          (item) => item.product.productId === productId
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedCart = [...localCart];
          updatedCart[existingItemIndex].quantity += quantity;
          
          // Apply max quantity if available
          if (updatedCart[existingItemIndex].maxQuantity) {
            updatedCart[existingItemIndex].quantity = Math.min(
              updatedCart[existingItemIndex].quantity,
              updatedCart[existingItemIndex].maxQuantity || 99
            );
          }
          
          setCartItems(updatedCart);
          setCartTotal(calculateCartTotals(updatedCart));
          saveLocalCart(updatedCart);
        } else {
          // Add new item to cart
          const newCart = [
            ...localCart,
            {
              itemId: `local-${Date.now()}`,
              product: processedProduct,
              quantity,
              maxQuantity: 99
            }
          ];
          
          setCartItems(newCart);
          setCartTotal(calculateCartTotals(newCart));
          saveLocalCart(newCart);
        }
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update item in cart
  const updateCartItem = async (itemId: number | string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure quantity is a positive number
      const safeQuantity = Math.max(0, quantity);
      
      if (isAuthenticated && user) {
        // Only make the API call if quantity is valid
        if (safeQuantity > 0) {
          await cartApi.updateCartItem(Number(itemId), safeQuantity);
        } else {
          // If quantity is 0, remove the item
          await cartApi.removeCartItem(Number(itemId));
        }
        await fetchCart();
      } else {
        // Update local cart
        const localCart = loadLocalCart();
        const updatedCart = [...localCart];
        
        const itemIndex = updatedCart.findIndex(
          (item) => String(item.itemId) === String(itemId)
        );
        
        if (itemIndex >= 0) {
          if (safeQuantity > 0) {
            // Update quantity
            updatedCart[itemIndex].quantity = safeQuantity;
          } else {
            // Remove item if quantity is 0
            updatedCart.splice(itemIndex, 1);
          }
          
          setCartItems(updatedCart);
          setCartTotal(calculateCartTotals(updatedCart));
          saveLocalCart(updatedCart);
        }
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update item in cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId: number | string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user) {
        // Remove item via API
        await cartApi.removeCartItem(Number(itemId));
        await fetchCart();
      } else {
        // Remove from local cart
        const localCart = loadLocalCart();
        const updatedCart = localCart.filter(
          (item) => String(item.itemId) !== String(itemId)
        );
        
        setCartItems(updatedCart);
        setCartTotal(calculateCartTotals(updatedCart));
        saveLocalCart(updatedCart);
      }
    } catch (err) {
      console.error('Error removing cart item:', err);
      setError('Failed to remove item from cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user) {
        // Clear API cart when authenticated
        try {
          await cartApi.clearCart();
        } catch (err) {
          // Fallback: Clear cart locally if API doesn't support it
          setCartItems([]);
          setCartTotal({ totalItems: 0, totalAmount: 0 });
        }
        await fetchCart();
      } else {
        // Clear local cart when not authenticated
        localStorage.removeItem(CART_STORAGE_KEY);
        setCartItems([]);
        setCartTotal({ totalItems: 0, totalAmount: 0 });
        setLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || 'Failed to clear cart. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Clear any error messages
  const clearError = () => {
    setError(null);
  };

  return {
    cartItems,
    cartTotal,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    clearError,
    fetchCart,
  };
} 