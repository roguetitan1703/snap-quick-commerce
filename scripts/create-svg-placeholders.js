const fs = require("fs");
const path = require("path");

// Define the directories to store SVGs
const productsDir = path.join(__dirname, "../public/images/products");
const categoriesDir = path.join(__dirname, "../public/images/categories");

// Ensure the directories exist
[productsDir, categoriesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define the product categories and products with appropriate icons and colors
const product_categories = {
  Dairy: {
    color: "#a3e635", // Light green
    icon: "🥛",
    products: [
      { name: "Milk", icon: "🥛", color: "#f5f5f5" },
      { name: "Cottage Cheese", icon: "🧀", color: "#fef3c7" },
      { name: "Cheese", icon: "🧀", color: "#fde68a" },
      { name: "Curd", icon: "🥣", color: "#f5f5f5" },
      { name: "Butter", icon: "🧈", color: "#fef3c7" },
      { name: "Yogurt", icon: "🥣", color: "#e0f2fe" },
    ],
  },
  Household: {
    color: "#93c5fd", // Light blue
    icon: "🧹",
    products: [
      { name: "Detergent", icon: "🧼", color: "#dbeafe" },
      { name: "Dishwasher", icon: "🍽️", color: "#e0f2fe" },
      { name: "Cleaning Cloth", icon: "🧻", color: "#f5f5f5" },
      { name: "Mop", icon: "🧹", color: "#dbeafe" },
      { name: "Broom", icon: "🧹", color: "#fde68a" },
      { name: "Toilet Paper", icon: "🧻", color: "#f5f5f5" },
    ],
  },
  "Personal Care": {
    color: "#c4b5fd", // Light purple
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
    color: "#fcd34d", // Light yellow
    icon: "🍿",
    products: [
      { name: "Chips", icon: "🍟", color: "#fef3c7" },
      { name: "Cookies", icon: "🍪", color: "#d6d3d1" },
      { name: "Biscuits", icon: "🍪", color: "#fef3c7" },
      { name: "Candy", icon: "🍬", color: "#fbcfe8" },
      { name: "Popcorn", icon: "🍿", color: "#fef3c7" },
      { name: "Granola Bars", icon: "🍫", color: "#d6d3d1" },
    ],
  },
  Beverages: {
    color: "#60a5fa", // Blue
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
    color: "#bae6fd", // Light blue
    icon: "❄️",
    products: [
      { name: "Ice Cream", icon: "🍦", color: "#f5f5f5" },
      { name: "Frozen Vegetables", icon: "🥦", color: "#d9f99d" },
      { name: "Frozen Pizza", icon: "🍕", color: "#fed7aa" },
      { name: "Frozen Meals", icon: "🍱", color: "#fecaca" },
      { name: "Frozen Fish", icon: "🐟", color: "#bae6fd" },
    ],
  },
};

// Create category SVGs
console.log("\n=== Creating Category SVGs ===");
Object.entries(product_categories).forEach(
  ([categoryName, { color, icon }]) => {
    const safeName = categoryName.toLowerCase().replace(/\s+/g, "-");
    const svgPath = path.join(categoriesDir, `${safeName}.svg`);

    // Create SVG content
    const svgContent = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="${color}" fill-opacity="0.2"/>
  <rect x="25" y="25" width="350" height="150" fill="${color}" fill-opacity="0.3" rx="10" ry="10"/>
  <text x="100" y="100" font-family="Arial" font-size="80" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="260" y="100" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#555555">${categoryName}</text>
</svg>`;

    // Write the SVG file
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ Created category SVG: ${safeName}.svg`);
  }
);

// Create product SVGs
console.log("\n=== Creating Product SVGs ===");
Object.entries(product_categories).forEach(([categoryName, { products }]) => {
  products.forEach(({ name, icon, color }) => {
    const safeName = name.toLowerCase().replace(/\s+/g, "-");
    const svgPath = path.join(productsDir, `${safeName}.svg`);

    // Create SVG content
    const svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${color}" fill-opacity="0.5"/>
  <rect x="50" y="50" width="300" height="300" fill="${color}" fill-opacity="0.7" rx="20" ry="20"/>
  <text x="200" y="180" font-family="Arial" font-size="120" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="200" y="260" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#555555">${name}</text>
  <text x="200" y="290" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#666666">${categoryName}</text>
</svg>`;

    // Write the SVG file
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ Created product SVG: ${safeName}.svg`);
  });
});

console.log("\n🎉 All SVGs created successfully!");
