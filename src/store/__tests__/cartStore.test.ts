import { act, renderHook } from '@testing-library/react';
import { useCartStore } from '../cartStore';

// Mock the zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: () => (fn: any) => fn,
}));

describe('cartStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product',
        price: 10.99,
        imageUrl: 'test-url.jpg',
        quantity: 1,
        maxQuantity: 10,
      });
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(expect.objectContaining({
      id: '1',
      productId: 'prod1',
      name: 'Test Product',
      price: 10.99,
      quantity: 1,
    }));
  });

  it('should increase quantity when adding the same product again', () => {
    const { result } = renderHook(() => useCartStore());
    
    // Add product first time
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product',
        price: 10.99,
        imageUrl: 'test-url.jpg',
        quantity: 1,
        maxQuantity: 10,
      });
    });
    
    // Add same product second time
    act(() => {
      result.current.addItem({
        id: '2', // Different ID
        productId: 'prod1', // Same product ID
        name: 'Test Product',
        price: 10.99,
        imageUrl: 'test-url.jpg',
        quantity: 2,
        maxQuantity: 10,
      });
    });
    
    // Should still have one item, but with quantity 3
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should not exceed maxQuantity when adding items', () => {
    const { result } = renderHook(() => useCartStore());
    
    // Add product with maxQuantity 5
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product',
        price: 10.99,
        imageUrl: 'test-url.jpg',
        quantity: 3,
        maxQuantity: 5,
      });
    });
    
    // Try to add more than maxQuantity
    act(() => {
      result.current.addItem({
        id: '2',
        productId: 'prod1',
        name: 'Test Product',
        price: 10.99,
        imageUrl: 'test-url.jpg',
        quantity: 3,
        maxQuantity: 5,
      });
    });
    
    // Should be capped at maxQuantity 5
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCartStore());
    
    // Add product
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product',
        price: 10.99,
        imageUrl: 'test-url.jpg',
        quantity: 1,
        maxQuantity: 10,
      });
    });
    
    // Update quantity
    act(() => {
      result.current.updateQuantity('1', 4);
    });
    
    expect(result.current.items[0].quantity).toBe(4);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    // Add two products
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product 1',
        price: 10.99,
        imageUrl: 'test-url-1.jpg',
        quantity: 1,
        maxQuantity: 10,
      });
    });
    
    act(() => {
      result.current.addItem({
        id: '2',
        productId: 'prod2',
        name: 'Test Product 2',
        price: 15.99,
        imageUrl: 'test-url-2.jpg',
        quantity: 1,
        maxQuantity: 10,
      });
    });
    
    // Remove first item
    act(() => {
      result.current.removeItem('1');
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('2');
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    // Add product
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product',
        price: 10.99,
        imageUrl: 'test-url.jpg',
        quantity: 1,
        maxQuantity: 10,
      });
    });
    
    // Clear cart
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate total items correctly', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product 1',
        price: 10.99,
        imageUrl: 'test-url-1.jpg',
        quantity: 2,
        maxQuantity: 10,
      });
    });
    
    act(() => {
      result.current.addItem({
        id: '2',
        productId: 'prod2',
        name: 'Test Product 2',
        price: 15.99,
        imageUrl: 'test-url-2.jpg',
        quantity: 3,
        maxQuantity: 10,
      });
    });
    
    expect(result.current.getTotalItems()).toBe(5);
  });

  it('should calculate subtotal correctly', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem({
        id: '1',
        productId: 'prod1',
        name: 'Test Product 1',
        price: 10.99,
        imageUrl: 'test-url-1.jpg',
        quantity: 2,
        maxQuantity: 10,
      });
    });
    
    act(() => {
      result.current.addItem({
        id: '2',
        productId: 'prod2',
        name: 'Test Product 2',
        price: 15.99,
        imageUrl: 'test-url-2.jpg',
        quantity: 3,
        maxQuantity: 10,
      });
    });
    
    // Subtotal should be (10.99 * 2) + (15.99 * 3) = 21.98 + 47.97 = 69.95
    expect(result.current.getSubtotal()).toBeCloseTo(69.95, 2);
  });
}); 