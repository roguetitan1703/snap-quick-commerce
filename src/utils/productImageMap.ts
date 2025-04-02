/**
 * Product image mappings with fallback SVGs
 */

// Map of category names to their SVG paths
export const categoryImageMap: Record<string, string> = {
  'Dairy': '/images/categories/dairy.svg',
  'Household': '/images/categories/household.svg',
  'Personal Care': '/images/categories/personal-care.svg',
  'Snacks': '/images/categories/snacks.svg',
  'Beverages': '/images/categories/beverages.svg',
  'Frozen Foods': '/images/categories/frozen-foods.svg',
  'Fruits & Vegetables': '/images/categories/dairy.svg', // Reusing dairy for now
};

// Map of product names to their SVG paths
export const productImageMap: Record<string, string> = {
  // Dairy
  'Milk': '/images/products/milk.svg',
  'Cottage Cheese': '/images/products/cottage-cheese.svg',
  'Cheese': '/images/products/cheese.svg',
  'Curd': '/images/products/curd.svg',
  'Butter': '/images/products/butter.svg',
  'Yogurt': '/images/products/yogurt.svg',
  'Fresh Milk 1L': '/images/products/milk.svg',
  'Almond Milk': '/images/products/almond-milk.svg',
  'Almond Milk 1L': '/images/products/almond-milk.svg',
  'Greek Yogurt': '/images/products/yogurt.svg',
  
  // Household
  'Detergent': '/images/products/detergent.svg',
  'Dishwasher': '/images/products/dishwasher.svg',
  'Cleaning Cloth': '/images/products/cleaning-cloth.svg',
  'Mop': '/images/products/mop.svg',
  'Broom': '/images/products/broom.svg',
  'Toilet Paper': '/images/products/toilet-paper.svg',
  'Toilet Paper 6 Rolls': '/images/products/toilet-paper.svg',
  'Liquid Hand Soap 250ml': '/images/products/soap.svg',
  
  // Personal Care
  'Shampoo': '/images/products/shampoo.svg',
  'Conditioner': '/images/products/conditioner.svg',
  'Soap': '/images/products/soap.svg',
  'Toothpaste': '/images/products/toothpaste.svg',
  'Deodorant': '/images/products/deodorant.svg',
  'Body Lotion': '/images/products/body-lotion.svg',
  
  // Snacks
  'Chips': '/images/products/chips.svg',
  'Cookies': '/images/products/cookies.svg',
  'Biscuits': '/images/products/biscuits.svg',
  'Candy': '/images/products/candy.svg',
  'Popcorn': '/images/products/popcorn.svg',
  'Granola Bars': '/images/products/granola-bars.svg',
  
  // Beverages
  'Juice': '/images/products/juice.svg',
  'Soda': '/images/products/soda.svg',
  'Tea': '/images/products/tea.svg',
  'Coffee': '/images/products/coffee.svg',
  'Water': '/images/products/water.svg',
  'Energy Drink': '/images/products/energy-drink.svg',
  
  // Frozen Foods
  'Ice Cream': '/images/products/ice-cream.svg',
  'Frozen Vegetables': '/images/products/frozen-vegetables.svg',
  'Frozen Pizza': '/images/products/frozen-pizza.svg',
  'Frozen Meals': '/images/products/frozen-meals.svg',
  'Frozen Fish': '/images/products/frozen-fish.svg',
  
  // Fruits & Vegetables
  'Organic Bananas (6 pcs)': '/images/products/banana.jpg',
  'Bananas': '/images/products/banana.svg',
  'Avocado (2 pcs)': '/images/products/avocado.jpg',
  'Avocado': '/images/products/avocado.svg',
  'Brown Eggs (6 pcs)': '/images/products/eggs.jpg',
  'Eggs': '/images/products/eggs.svg',
  'Bread': '/images/products/bread.svg',
  'Sourdough Bread': '/images/products/bread.svg',
  'Berries': '/images/products/berries.svg',
  'Mixed Berries': '/images/products/berries.svg',
  'Mixed Berries Pack': '/images/products/berries.svg',
  'Strawberries': '/images/products/strawberries.svg',
  'Vegetables': '/images/products/vegetables.svg',
  'Spinach': '/images/products/vegetables.svg',
  'Organic Spinach 250g': '/images/products/spinach.jpg',
};

/**
 * Get a fallback image URL for a product
 * @param productName - The name of the product
 * @returns The URL of the fallback SVG
 */
export const getFallbackImage = (productName: string): string => {
  return productImageMap[productName] || '/images/placeholder-product.svg';
};

/**
 * Get a fallback image URL for a category
 * @param categoryName - The name of the category
 * @returns The URL of the fallback SVG
 */
export const getCategoryFallbackImage = (categoryName: string): string => {
  return categoryImageMap[categoryName] || '/images/placeholder-category.svg';
};

/**
 * Get local image path for product from external URL
 * This function handles both backend API image URLs and product names
 * to ensure we use local image assets when available
 * 
 * @param productName - The name of the product 
 * @param externalUrl - The external URL (can be from backend API)
 * @returns A local image path when available, or the original URL
 */
export const getLocalImagePath = (productName: string, externalUrl: string): string => {
  // If the product name is in our map, use the local path
  if (productImageMap[productName]) {
    return productImageMap[productName];
  }

  // If the URL is already a local path, return it
  if (externalUrl.startsWith('/images/')) {
    return externalUrl;
  }

  // Default to placeholder for external URLs
  return '/images/placeholder-product.svg';
}; 