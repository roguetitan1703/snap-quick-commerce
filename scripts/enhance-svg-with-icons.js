const fs = require("fs");
const path = require("path");

// Define the directories containing SVGs
const productsDir = path.join(__dirname, "../public/images/products");
const categoriesDir = path.join(__dirname, "../public/images/categories");

// Common SVG icons paths (simplified vector paths)
const iconPaths = {
  // Dairy products
  milk: "M90,120 v160 h60 v-160 h60 v160 h60 v-160 a20,20 0 0 0 -20,-20 h-140 a20,20 0 0 0 -20,20 Z M110,100 v-30 a10,10 0 0 1 10,-10 h120 a10,10 0 0 1 10,10 v30 Z",
  cheese:
    "M50,150 l150,-100 h100 l50,100 v100 h-300 Z M130,150 a20,20 0 1 1 0,0.1 M200,200 a15,15 0 1 1 0,0.1 M100,220 a25,25 0 1 1 0,0.1",
  yogurt:
    "M100,120 v140 a20,20 0 0 0 20,20 h120 a20,20 0 0 0 20,-20 v-140 Z M80,120 h200 v-20 a20,20 0 0 0 -20,-20 h-160 a20,20 0 0 0 -20,20 v20 Z M140,160 h80 M140,200 h80 M140,240 h80",

  // Household items
  broom:
    "M180,40 l20,300 M140,80 h80 M150,40 q-50,80 -80,130 a20,20 0 0 0 0,20 q60,70 120,0 a20,20 0 0 0 0,-20 q-30,-50 -80,-130 Z",
  detergent:
    "M150,100 h100 v200 a20,20 0 0 1 -20,20 h-60 a20,20 0 0 1 -20,-20 Z M180,100 v-40 h40 v40 M160,150 h80 M160,180 h80 M160,210 h80",
  toilet_paper:
    "M150,280 h100 v-180 a50,50 0 0 0 -100,0 Z M150,100 a50,50 0 0 1 100,0 M200,60 v40 M130,200 h-30 a50,80 0 0 1 0,-160 h30",

  // Personal care
  shampoo:
    "M140,280 h80 v-120 h-80 Z M150,160 l-30,-40 h120 l-30,40 M180,120 v-40 a10,10 0 0 0 -10,-10 h-20 a10,10 0 0 0 -10,10 v40",
  soap: "M100,160 q0,-30 40,-40 h80 q40,10 40,40 v80 q0,30 -40,40 h-80 q-40,-10 -40,-40 Z",
  toothbrush:
    "M90,250 l120,-120 l60,60 l-120,120 Z M120,220 l60,60 M90,250 q-20,20 10,40 l30,-30 M210,130 l20,20 q5,5 10,0 l40,-40 q5,-5 0,-10 l-20,-20 Z",

  // Snacks
  chips:
    "M120,280 h120 a30,30 0 0 0 30,-30 v-160 a20,20 0 0 0 -20,-20 h-140 a20,20 0 0 0 -20,20 v160 a30,30 0 0 0 30,30 Z M120,80 l40,-20 l40,20 l40,-20",
  cookies:
    "M180,80 a100,100 0 1 0 0.1,0 Z M150,150 a20,20 0 1 1 0,0.1 M200,110 a25,25 0 1 1 0,0.1 M220,170 a15,15 0 1 1 0,0.1 M130,200 a18,18 0 1 1 0,0.1 M230,230 a13,13 0 1 1 0,0.1",
  candy:
    "M100,180 l60,-60 l80,80 l60,-60 M240,140 a20,20 0 1 1 0.1,0 M160,140 a20,20 0 1 1 0.1,0 M200,200 a20,20 0 1 1 0.1,0",

  // Beverages
  juice:
    "M140,280 h80 v-170 l-30,-30 h-20 l-30,30 Z M140,150 h80 M160,110 v-50 M200,110 v-50",
  coffee:
    "M100,140 h160 v80 a60,60 0 0 1 -60,60 h-40 a60,60 0 0 1 -60,-60 Z M100,140 a20,20 0 0 1 20,-20 h120 a20,20 0 0 1 20,20 M240,170 a30,30 0 0 0 30,-30 v-20 h-30",
  tea: "M100,200 h160 v-20 h-160 Z M120,180 v-80 a60,60 0 0 1 120,0 v80 M120,180 a20,20 0 0 1 -20,20 v30 h160 v-30 a20,20 0 0 1 -20,-20",

  // Frozen foods
  ice_cream:
    "M130,100 l30,180 l30,-180 Z M130,100 a40,40 0 0 1 60,0 M140,140 h40 M150,180 h20",
  pizza:
    "M80,200 a130,130 0 0 1 220,-92.5 l-110,192.5 Z M135,170 a20,20 0 1 1 0.1,0 M180,120 a15,15 0 1 1 0.1,0 M210,180 a18,18 0 1 1 0.1,0",
  frozen_meals:
    "M80,140 h200 v100 h-200 Z M120,140 v100 M200,140 v100 M80,190 h200",

  // Generic
  grocery_bag:
    "M100,280 h160 l20,-180 h-200 Z M140,100 v-40 a20,20 0 0 1 20,-20 h40 a20,20 0 0 1 20,20 v40",
  shopping_cart:
    "M80,80 h30 l30,160 h140 M140,280 a20,20 0 1 1 0.1,0 M240,280 a20,20 0 1 1 0.1,0 M120,140 h160 M130,180 h140",
  placeholder:
    "M100,100 h160 v160 h-160 Z M100,100 l160,160 M260,100 l-160,160",
};

// Enhanced product SVG template with actual icons
const enhancedProductSVG = (name, iconKey, color, categoryName) => {
  // Get icon path or use placeholder if not found
  const iconPath = iconPaths[iconKey] || iconPaths.placeholder;

  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
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
  
  <!-- Product icon -->
  <g transform="scale(0.5) translate(200, 150)">
    <path d="${iconPath}" fill="${color}" stroke="#333" stroke-width="6"/>
  </g>
  
  <!-- Product name -->
  <text x="200" y="260" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#333333">${name}</text>
</svg>`;
};

// Enhanced category SVG template with actual icons
const enhancedCategorySVG = (name, iconKey, color) => {
  // Get icon path or use placeholder if not found
  const iconPath = iconPaths[iconKey] || iconPaths.placeholder;

  return `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
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
  
  <!-- Icon container -->
  <circle cx="100" cy="100" r="60" fill="white" fill-opacity="0.9" filter="url(#shadow)"/>
  
  <!-- Category icon -->
  <g transform="scale(0.3) translate(200, 220)">
    <path d="${iconPath}" fill="${color}" stroke="#333" stroke-width="8"/>
  </g>
  
  <!-- Category name -->
  <text x="260" y="100" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">${name}</text>
  
  <!-- Decorative elements -->
  <circle cx="350" cy="40" r="15" fill="white" fill-opacity="0.3"/>
  <circle cx="320" cy="160" r="10" fill="white" fill-opacity="0.2"/>
  <circle cx="380" cy="130" r="8" fill="white" fill-opacity="0.2"/>
</svg>`;
};

// Define products and categories with their improved design properties
const product_categories = {
  Dairy: {
    color: "#22c55e", // Green
    iconKey: "milk",
    products: [
      { name: "Milk", iconKey: "milk", color: "#dcfce7" },
      { name: "Cottage Cheese", iconKey: "cheese", color: "#dcfce7" },
      { name: "Cheese", iconKey: "cheese", color: "#fde68a" },
      { name: "Curd", iconKey: "yogurt", color: "#f9fafb" },
      { name: "Butter", iconKey: "cheese", color: "#fef9c3" },
      { name: "Yogurt", iconKey: "yogurt", color: "#dbeafe" },
    ],
  },
  Household: {
    color: "#3b82f6", // Blue
    iconKey: "broom",
    products: [
      { name: "Detergent", iconKey: "detergent", color: "#dbeafe" },
      { name: "Dishwasher", iconKey: "detergent", color: "#dbeafe" },
      { name: "Cleaning Cloth", iconKey: "soap", color: "#f3f4f6" },
      { name: "Mop", iconKey: "broom", color: "#e0f2fe" },
      { name: "Broom", iconKey: "broom", color: "#fed7aa" },
      { name: "Toilet Paper", iconKey: "toilet_paper", color: "#f3f4f6" },
    ],
  },
  "Personal Care": {
    color: "#8b5cf6", // Purple
    iconKey: "shampoo",
    products: [
      { name: "Shampoo", iconKey: "shampoo", color: "#ddd6fe" },
      { name: "Conditioner", iconKey: "shampoo", color: "#ede9fe" },
      { name: "Soap", iconKey: "soap", color: "#f5d0fe" },
      { name: "Toothpaste", iconKey: "toothbrush", color: "#dbeafe" },
      { name: "Deodorant", iconKey: "detergent", color: "#ddd6fe" },
      { name: "Body Lotion", iconKey: "shampoo", color: "#fef9c3" },
    ],
  },
  Snacks: {
    color: "#f59e0b", // Amber
    iconKey: "chips",
    products: [
      { name: "Chips", iconKey: "chips", color: "#fef3c7" },
      { name: "Cookies", iconKey: "cookies", color: "#fed7aa" },
      { name: "Biscuits", iconKey: "cookies", color: "#fef3c7" },
      { name: "Candy", iconKey: "candy", color: "#fbcfe8" },
      { name: "Popcorn", iconKey: "chips", color: "#fef3c7" },
      { name: "Granola Bars", iconKey: "cookies", color: "#d6d3d1" },
    ],
  },
  Beverages: {
    color: "#0ea5e9", // Sky Blue
    iconKey: "juice",
    products: [
      { name: "Juice", iconKey: "juice", color: "#fde68a" },
      { name: "Soda", iconKey: "juice", color: "#dbeafe" },
      { name: "Tea", iconKey: "tea", color: "#bae6fd" },
      { name: "Coffee", iconKey: "coffee", color: "#d6d3d1" },
      { name: "Water", iconKey: "juice", color: "#e0f2fe" },
      { name: "Energy Drink", iconKey: "juice", color: "#fef08a" },
    ],
  },
  "Frozen Foods": {
    color: "#0284c7", // Light Blue
    iconKey: "ice_cream",
    products: [
      { name: "Ice Cream", iconKey: "ice_cream", color: "#f9fafb" },
      { name: "Frozen Vegetables", iconKey: "frozen_meals", color: "#d9f99d" },
      { name: "Frozen Pizza", iconKey: "pizza", color: "#fed7aa" },
      { name: "Frozen Meals", iconKey: "frozen_meals", color: "#fecaca" },
      { name: "Frozen Fish", iconKey: "frozen_meals", color: "#bae6fd" },
    ],
  },
};

// Special cases for existing products
const specialProducts = [
  {
    filename: "banana",
    name: "Banana",
    iconKey: "grocery_bag",
    color: "#fef08a",
    category: "Fruits & Vegetables",
  },
  {
    filename: "avocado",
    name: "Avocado",
    iconKey: "grocery_bag",
    color: "#d9f99d",
    category: "Fruits & Vegetables",
  },
  {
    filename: "eggs",
    name: "Eggs",
    iconKey: "grocery_bag",
    color: "#fef9c3",
    category: "Dairy",
  },
  {
    filename: "bread",
    name: "Bread",
    iconKey: "grocery_bag",
    color: "#fed7aa",
    category: "Bakery",
  },
  {
    filename: "berries",
    name: "Berries",
    iconKey: "grocery_bag",
    color: "#c7d2fe",
    category: "Fruits & Vegetables",
  },
  {
    filename: "almond-milk",
    name: "Almond Milk",
    iconKey: "milk",
    color: "#f3f4f6",
    category: "Dairy",
  },
  {
    filename: "vegetables",
    name: "Vegetables",
    iconKey: "grocery_bag",
    color: "#bbf7d0",
    category: "Fruits & Vegetables",
  },
  {
    filename: "strawberries",
    name: "Strawberries",
    iconKey: "grocery_bag",
    color: "#fecaca",
    category: "Fruits & Vegetables",
  },
];

// Enhance all SVGs
console.log("=== Enhancing SVG Designs with Actual Icons ===");

// Make sure directories exist
[productsDir, categoriesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Enhance category SVGs
Object.entries(product_categories).forEach(
  ([categoryName, { color, iconKey }]) => {
    const safeName = categoryName.toLowerCase().replace(/\s+/g, "-");
    const svgPath = path.join(categoriesDir, `${safeName}.svg`);

    // Create enhanced SVG
    const enhancedSVG = enhancedCategorySVG(categoryName, iconKey, color);
    fs.writeFileSync(svgPath, enhancedSVG);
    console.log(`✅ Enhanced category SVG with actual icon: ${safeName}.svg`);
  }
);

// Enhance product SVGs
Object.entries(product_categories).forEach(([categoryName, { products }]) => {
  products.forEach(({ name, iconKey, color }) => {
    const safeName = name.toLowerCase().replace(/\s+/g, "-");
    const svgPath = path.join(productsDir, `${safeName}.svg`);

    // Create enhanced SVG
    const enhancedSVG = enhancedProductSVG(name, iconKey, color, categoryName);
    fs.writeFileSync(svgPath, enhancedSVG);
    console.log(`✅ Enhanced product SVG with actual icon: ${safeName}.svg`);
  });
});

// Handle special cases for existing products
specialProducts.forEach(({ filename, name, iconKey, color, category }) => {
  const svgPath = path.join(productsDir, `${filename}.svg`);

  // Create enhanced SVG
  const enhancedSVG = enhancedProductSVG(name, iconKey, color, category);
  fs.writeFileSync(svgPath, enhancedSVG);
  console.log(
    `✅ Enhanced special product SVG with actual icon: ${filename}.svg`
  );
});

console.log("✨ All SVGs have been enhanced with actual vector icons!");
