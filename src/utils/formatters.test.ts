import { 
  capitalize, 
  formatPrice, 
  truncateText, 
  formatDate 
} from './formatters';

// Import jest types to fix TypeScript errors
import 'jest';

describe('Formatter Utilities', () => {
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

  describe('truncateText', () => {
    it('does not truncate text shorter than max length', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('truncates text longer than max length', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
    });

    it('handles exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      // Create a specific date for testing to avoid timezone issues
      const date = new Date(2023, 0, 15); // January 15, 2023
      
      // When run in US locale, should format as "January 15, 2023"
      expect(formatDate(date)).toMatch(/January 15, 2023/);
    });
  });
}); 