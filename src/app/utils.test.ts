/**
 * This is a basic test file to verify that Jest is properly set up
 */

// Simple utility functions to test
function sum(a: number, b: number): number {
  return a + b;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Tests
describe('Utility Functions', () => {
  describe('sum', () => {
    it('adds two positive numbers correctly', () => {
      expect(sum(1, 2)).toBe(3);
    });

    it('handles negative numbers', () => {
      expect(sum(-1, -2)).toBe(-3);
      expect(sum(-1, 5)).toBe(4);
    });

    it('handles zero', () => {
      expect(sum(0, 0)).toBe(0);
      expect(sum(5, 0)).toBe(5);
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter and lowercases rest', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('javaScript')).toBe('Javascript');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('formatPrice', () => {
    it('formats price with dollar sign and two decimal places', () => {
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(10.5)).toBe('$10.50');
      expect(formatPrice(10.99)).toBe('$10.99');
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('handles more than two decimal places', () => {
      expect(formatPrice(10.999)).toBe('$11.00');
      expect(formatPrice(10.991)).toBe('$10.99');
    });
  });
}); 