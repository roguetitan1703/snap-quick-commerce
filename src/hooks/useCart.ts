import { useState, useEffect } from 'react';
import { cartApi } from '@/utils/api';
import { useAuth } from './useAuth';
import { getLocalImagePath } from '@/utils/productImageMap';

// Local storage key for cart data
const CART_STORAGE_KEY = 'snap-quick-commerce-cart';

// Export interfaces so they can be imported elsewhere
export interface CartItem {
  itemId: number | string;
  product: {
    productId: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
  };
  quantity: number;
  maxQuantity?: number;
}

export interface CartTotal {
  totalItems: number;
  totalAmount: number;
}

interface UseCartResult {
  cartItems: CartItem[];
  cartTotal: CartTotal;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, product: any, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number | string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number | string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

export function useCart(): UseCartResult {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<CartTotal>({ totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Calculate cart totals from items
  const calculateCartTotals = (items: CartItem[]): CartTotal => {
    return {
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
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
    if (isAuthenticated) {
      fetchApiCart();
    } else {
      // Load cart from local storage when not authenticated
      const localCart = loadLocalCart();
      setCartItems(localCart);
      setCartTotal(calculateCartTotals(localCart));
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart from API
  const fetchApiCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch cart items from API
      const cartResponse = await cartApi.getCart();
      setCartItems(cartResponse.data);
      
      // Fetch cart total from API or calculate from items
      try {
        const totalResponse = await cartApi.getCartTotal();
        setCartTotal(totalResponse.data);
      } catch (err) {
        // Fallback to calculating totals if API endpoint fails
        setCartTotal(calculateCartTotals(cartResponse.data));
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: number, product: any, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Add to cart via API when authenticated
        await cartApi.addToCart(productId, quantity);
        await fetchApiCart();
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
          const newItem: CartItem = {
            itemId: `local-${Date.now()}`,
            product: processedProduct,
            quantity,
            maxQuantity: 99 // Default max quantity
          };
          
          const updatedCart = [...localCart, newItem];
          setCartItems(updatedCart);
          setCartTotal(calculateCartTotals(updatedCart));
          saveLocalCart(updatedCart);
        }
        
        setLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || 'Failed to add item to cart. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: number | string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Update via API when authenticated
        if (typeof itemId === 'number') {
          await cartApi.updateCartItem(itemId, quantity);
          await fetchApiCart();
        } else {
          throw new Error('Invalid item ID for API cart update');
        }
      } else {
        // Update local cart when not authenticated
        const localCart = loadLocalCart();
        const updatedCart = localCart.map(item => 
          item.itemId === itemId 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        );
        
        setCartItems(updatedCart);
        setCartTotal(calculateCartTotals(updatedCart));
        saveLocalCart(updatedCart);
        setLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || 'Failed to update cart item. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId: number | string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Remove via API when authenticated
        if (typeof itemId === 'number') {
          await cartApi.removeCartItem(itemId);
          await fetchApiCart();
        } else {
          throw new Error('Invalid item ID for API cart removal');
        }
      } else {
        // Remove from local cart when not authenticated
        const localCart = loadLocalCart();
        const updatedCart = localCart.filter(item => item.itemId !== itemId);
        
        setCartItems(updatedCart);
        setCartTotal(calculateCartTotals(updatedCart));
        saveLocalCart(updatedCart);
        setLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || 'Failed to remove item from cart. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Clear API cart when authenticated
        // Note: Assuming an API endpoint exists for clearing the cart
        // If not, you'd need to iterate through items and remove them individually
        try {
          await cartApi.clearCart(); // Add this method to cartApi if it exists
        } catch (err) {
          // Fallback: Clear cart locally if API doesn't support it
          setCartItems([]);
          setCartTotal({ totalItems: 0, totalAmount: 0 });
        }
        await fetchApiCart();
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
  };
} 