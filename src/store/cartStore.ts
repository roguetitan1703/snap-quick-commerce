import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// Helper function to ensure we're using local image paths
const getLocalImagePath = (productName: string, externalUrl: string): string => {
  // Map common product names to local image paths
  const imageMap: Record<string, string> = {
    'Organic Bananas (6 pcs)': '/images/products/banana.jpg',
    'Fresh Milk 1L': '/images/products/milk.jpg',
    'Brown Eggs (6 pcs)': '/images/products/eggs.jpg',
    'Avocado (2 pcs)': '/images/products/avocado.jpg',
    'Greek Yogurt': '/images/products/yogurt.jpg',
    'Sourdough Bread': '/images/products/bread.svg',
    'Almond Milk 1L': '/images/products/almond-milk.svg',
    'Organic Spinach 250g': '/images/products/spinach.jpg',
    'Mixed Berries Pack': '/images/products/berries.svg',
    'Toilet Paper 6 Rolls': '/images/products/toilet-paper.svg',
    'Liquid Hand Soap 250ml': '/images/products/soap.svg'
  };

  // If the product name is in our map, use the local path
  if (imageMap[productName]) {
    return imageMap[productName];
  }

  // If the URL is already a local path, return it
  if (externalUrl.startsWith('/images/')) {
    return externalUrl;
  }

  // Default to placeholder for external URLs
  return '/images/placeholder-product.svg';
};

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  maxQuantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  decrementItem: (productId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      
      addItem: (newItem) => {
        // Ensure we're using local image paths
        const localImageUrl = getLocalImagePath(newItem.name, newItem.imageUrl);
        const itemWithLocalImage = {
          ...newItem,
          imageUrl: localImageUrl
        };

        set((state) => {
          // Check if the item already exists in the cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === itemWithLocalImage.productId
          );

          if (existingItemIndex >= 0) {
            // Update the quantity of the existing item
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = Math.min(
              existingItem.quantity + itemWithLocalImage.quantity,
              existingItem.maxQuantity
            );
            
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
            
            return { items: updatedItems };
          } else {
            // Add the new item to the cart
            return { items: [...state.items, itemWithLocalImage] };
          }
        });
      },
      decrementItem: (productId) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === productId
          );

          if (existingItemIndex === -1) {
            return state; // Item not found, return state unchanged
          }

          const updatedItems = [...state.items];
          const existingItem = updatedItems[existingItemIndex];

          // If quantity is 1, remove the item
          if (existingItem.quantity === 1) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          // Otherwise decrement the quantity
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity - 1,
          };

          return { items: updatedItems };
        });
      },
      
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { 
                  ...item, 
                  quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) 
                }
              : item
          ),
        }));
      },
      
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'snap-cart-storage',
    }
  )
); 