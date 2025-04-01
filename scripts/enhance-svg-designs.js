const fs = require("fs");
const path = require("path");

// Define the directories containing SVGs
const productsDir = path.join(__dirname, "../public/images/products");
const categoriesDir = path.join(__dirname, "../public/images/categories");

// Define enhanced product SVG templates
const enhancedProductSVG = (
  name,
  icon,
  color,
  categoryName
) => `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.5"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Main background -->
  <rect width="400" height="400" fill="url(#bgGradient)" rx="20" ry="20"/>
  
  <!-- Product container -->
  <rect x="50" y="50" width="300" height="300" fill="white" fill-opacity="0.9" rx="15" ry="15" filter="url(#shadow)"/>
  
  <!-- Category label -->
  <rect x="50" y="310" width="300" height="40" fill="${color}" fill-opacity="0.8" rx="0" ry="0"/>
  <text x="200" y="335" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">${categoryName}</text>
  
  <!-- Product icon with circle background -->
  <circle cx="200" cy="150" r="80" fill="${color}" fill-opacity="0.2"/>
  <text x="200" y="170" font-family="Arial, sans-serif" font-size="100" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  
  <!-- Product name -->
  <text x="200" y="260" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#333333">${name}</text>
</svg>`;

// Define enhanced category SVG templates
const enhancedCategorySVG = (
  name,
  icon,
  color
) => `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.7"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Main background -->
  <rect width="400" height="200" fill="url(#bgGradient)" rx="15" ry="15"/>
  
  <!-- Icon circle -->
  <circle cx="100" cy="100" r="60" fill="white" fill-opacity="0.9" filter="url(#shadow)"/>
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  
  <!-- Category name -->
  <text x="260" y="100" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">${name}</text>
  
  <!-- Decorative elements -->
  <circle cx="350" cy="40" r="15" fill="white" fill-opacity="0.3"/>
  <circle cx="320" cy="160" r="10" fill="white" fill-opacity="0.2"/>
  <circle cx="380" cy="130" r="8" fill="white" fill-opacity="0.2"/>
</svg>`;

// Define products and categories with their improved design properties
const product_categories = {
  Dairy: {
    color: "#22c55e", // Green
    icon: "🥛",
    products: [
      { name: "Milk", icon: "🥛", color: "#dcfce7" },
      { name: "Cottage Cheese", icon: "🧀", color: "#dcfce7" },
      { name: "Cheese", icon: "🧀", color: "#fde68a" },
      { name: "Curd", icon: "🥣", color: "#f9fafb" },
      { name: "Butter", icon: "🧈", color: "#fef9c3" },
      { name: "Yogurt", icon: "🥣", color: "#dbeafe" },
    ],
  },
  Household: {
    color: "#3b82f6", // Blue
    icon: "🧹",
    products: [
      { name: "Detergent", icon: "🧼", color: "#dbeafe" },
      { name: "Dishwasher", icon: "🍽️", color: "#dbeafe" },
      { name: "Cleaning Cloth", icon: "🧻", color: "#f3f4f6" },
      { name: "Mop", icon: "🧹", color: "#e0f2fe" },
      { name: "Broom", icon: "🧹", color: "#fed7aa" },
      { name: "Toilet Paper", icon: "🧻", color: "#f3f4f6" },
    ],
  },
  "Personal Care": {
    color: "#8b5cf6", // Purple
    icon: "🧴",
    products: [
      { name: "Shampoo", icon: "🧴", color: "#ddd6fe" },
      { name: "Conditioner", icon: "🧴", color: "#ede9fe" },
      { name: "Soap", icon: "🧼", color: "#f5d0fe" },
      { name: "Toothpaste", icon: "🪥", color: "#dbeafe" },
      { name: "Deodorant", icon: "🧴", color: "#ddd6fe" },
      { name: "Body Lotion", icon: "🧴", color: "#fef9c3" },
    ],
  },
  Snacks: {
    color: "#f59e0b", // Amber
    icon: "🍿",
    products: [
      { name: "Chips", icon: "🍟", color: "#fef3c7" },
      { name: "Cookies", icon: "🍪", color: "#fed7aa" },
      { name: "Biscuits", icon: "🍪", color: "#fef3c7" },
      { name: "Candy", icon: "🍬", color: "#fbcfe8" },
      { name: "Popcorn", icon: "🍿", color: "#fef3c7" },
      { name: "Granola Bars", icon: "🍫", color: "#d6d3d1" },
    ],
  },
  Beverages: {
    color: "#0ea5e9", // Sky Blue
    icon: "🥤",
    products: [
      { name: "Juice", icon: "🧃", color: "#fde68a" },
      { name: "Soda", icon: "🥤", color: "#dbeafe" },
      { name: "Tea", icon: "🫖", color: "#bae6fd" },
      { name: "Coffee", icon: "☕", color: "#d6d3d1" },
      { name: "Water", icon: "💧", color: "#e0f2fe" },
      { name: "Energy Drink", icon: "⚡", color: "#fef08a" },
    ],
  },
  "Frozen Foods": {
    color: "#0284c7", // Light Blue
    icon: "❄️",
    products: [
      { name: "Ice Cream", icon: "🍦", color: "#f9fafb" },
      { name: "Frozen Vegetables", icon: "🥦", color: "#d9f99d" },
      { name: "Frozen Pizza", icon: "🍕", color: "#fed7aa" },
      { name: "Frozen Meals", icon: "🍱", color: "#fecaca" },
      { name: "Frozen Fish", icon: "🐟", color: "#bae6fd" },
    ],
  },
};

// Enhance all SVGs
console.log("=== Enhancing SVG Designs ===");

// Enhance category SVGs
Object.entries(product_categories).forEach(
  ([categoryName, { color, icon }]) => {
    const safeName = categoryName.toLowerCase().replace(/\s+/g, "-");
    const svgPath = path.join(categoriesDir, `${safeName}.svg`);

    if (fs.existsSync(svgPath)) {
      // Create enhanced SVG
      const enhancedSVG = enhancedCategorySVG(categoryName, icon, color);
      fs.writeFileSync(svgPath, enhancedSVG);
      console.log(`✅ Enhanced category SVG: ${safeName}.svg`);
    } else {
      console.log(`⚠️ Category SVG not found: ${safeName}.svg`);
    }
  }
);

// Enhance product SVGs
Object.entries(product_categories).forEach(([categoryName, { products }]) => {
  products.forEach(({ name, icon, color }) => {
    const safeName = name.toLowerCase().replace(/\s+/g, "-");
    const svgPath = path.join(productsDir, `${safeName}.svg`);

    if (fs.existsSync(svgPath)) {
      // Create enhanced SVG
      const enhancedSVG = enhancedProductSVG(name, icon, color, categoryName);
      fs.writeFileSync(svgPath, enhancedSVG);
      console.log(`✅ Enhanced product SVG: ${safeName}.svg`);
    } else {
      console.log(`⚠️ Product SVG not found: ${safeName}.svg`);
    }
  });
});

// Handle special cases for existing products
const specialProducts = [
  {
    filename: "banana",
    name: "Banana",
    icon: "🍌",
    color: "#fef08a",
    category: "Fruits & Vegetables",
  },
  {
    filename: "avocado",
    name: "Avocado",
    icon: "🥑",
    color: "#d9f99d",
    category: "Fruits & Vegetables",
  },
  {
    filename: "eggs",
    name: "Eggs",
    icon: "🥚",
    color: "#fef9c3",
    category: "Dairy",
  },
  {
    filename: "bread",
    name: "Bread",
    icon: "🍞",
    color: "#fed7aa",
    category: "Bakery",
  },
  {
    filename: "berries",
    name: "Berries",
    icon: "🫐",
    color: "#c7d2fe",
    category: "Fruits & Vegetables",
  },
  {
    filename: "almond-milk",
    name: "Almond Milk",
    icon: "🥛",
    color: "#f3f4f6",
    category: "Dairy",
  },
  {
    filename: "vegetables",
    name: "Vegetables",
    icon: "🥗",
    color: "#bbf7d0",
    category: "Fruits & Vegetables",
  },
  {
    filename: "strawberries",
    name: "Strawberries",
    icon: "🍓",
    color: "#fecaca",
    category: "Fruits & Vegetables",
  },
];

specialProducts.forEach(({ filename, name, icon, color, category }) => {
  const svgPath = path.join(productsDir, `${filename}.svg`);

  if (fs.existsSync(svgPath)) {
    // Create enhanced SVG
    const enhancedSVG = enhancedProductSVG(name, icon, color, category);
    fs.writeFileSync(svgPath, enhancedSVG);
    console.log(`✅ Enhanced special product SVG: ${filename}.svg`);
  }
});

console.log("✨ All SVGs have been enhanced with improved designs!");
