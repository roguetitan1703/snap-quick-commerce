const fs = require("fs");
const path = require("path");

// Define the public images directory
const publicImagesDir = path.join(__dirname, "../public/images/products");

// Ensure the directory exists
if (!fs.existsSync(publicImagesDir)) {
  console.log(`Creating directory: ${publicImagesDir}`);
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Missing image files that need SVG placeholders
const missingImages = [
  { name: "vegetables", color: "#4ade80", icon: "🥗" }, // Green for vegetables
  { name: "strawberries", color: "#f87171", icon: "🍓" }, // Red for strawberries
  { name: "berries", color: "#818cf8", icon: "🫐" }, // Blue/purple for berries
];

// Create an SVG placeholder for each missing image
missingImages.forEach(({ name, color, icon }) => {
  const svgPath = path.join(publicImagesDir, `${name}.svg`);

  // Check if the SVG already exists
  if (fs.existsSync(svgPath)) {
    console.log(`SVG already exists: ${svgPath}`);
    return;
  }

  // Check if the JPG exists
  const jpgPath = path.join(publicImagesDir, `${name}.jpg`);
  if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 0) {
    console.log(`JPG already exists and is not empty: ${jpgPath}`);
    return;
  }

  // Create SVG content
  const svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${color}" fill-opacity="0.2"/>
  <rect x="50" y="50" width="300" height="300" fill="${color}" fill-opacity="0.3" rx="20" ry="20"/>
  <text x="200" y="180" font-family="Arial" font-size="120" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="200" y="260" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#555555">${name}</text>
</svg>`;

  // Write the SVG file
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created SVG placeholder: ${svgPath}`);

  // If the JPG exists but is empty or corrupted, rename it
  if (fs.existsSync(jpgPath)) {
    const backupPath = path.join(publicImagesDir, `${name}.jpg.corrupted`);
    fs.renameSync(jpgPath, backupPath);
    console.log(`Renamed corrupted JPG: ${jpgPath} → ${backupPath}`);
  }
});

// Create SVG placeholder for categories as well
const categoriesDir = path.join(__dirname, "../public/images/categories");
if (!fs.existsSync(categoriesDir)) {
  console.log(`Creating directory: ${categoriesDir}`);
  fs.mkdirSync(categoriesDir, { recursive: true });
}

// Missing category images
const missingCategories = [
  { name: "fruits-vegetables", color: "#4ade80", icon: "🥕" },
  { name: "dairy-eggs", color: "#a1a1aa", icon: "🥚" },
  { name: "snacks", color: "#facc15", icon: "🍿" },
  { name: "beverages", color: "#38bdf8", icon: "🥤" },
  { name: "bakery", color: "#f59e0b", icon: "🍞" },
  { name: "personal-care", color: "#c084fc", icon: "🧴" },
  { name: "cleaning", color: "#22d3ee", icon: "🧹" },
  { name: "baby-care", color: "#fb7185", icon: "🍼" },
];

// Create an SVG placeholder for each missing category
missingCategories.forEach(({ name, color, icon }) => {
  const svgPath = path.join(categoriesDir, `${name}.svg`);
  const jpgPath = path.join(categoriesDir, `${name}.jpg`);

  // Check if either SVG or JPG already exists
  if (fs.existsSync(svgPath)) {
    console.log(`Category SVG already exists: ${svgPath}`);
    return;
  }

  if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 0) {
    console.log(`Category JPG already exists and is not empty: ${jpgPath}`);
    return;
  }

  // Create SVG content
  const svgContent = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="${color}" fill-opacity="0.2"/>
  <rect x="25" y="25" width="350" height="150" fill="${color}" fill-opacity="0.3" rx="10" ry="10"/>
  <text x="100" y="100" font-family="Arial" font-size="80" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="260" y="100" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#555555">${name.replace(
    "-",
    " "
  )}</text>
</svg>`;

  // Write the SVG file
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created category SVG placeholder: ${svgPath}`);

  // If the JPG exists but is empty or corrupted, rename it
  if (fs.existsSync(jpgPath)) {
    const backupPath = path.join(categoriesDir, `${name}.jpg.corrupted`);
    fs.renameSync(jpgPath, backupPath);
    console.log(`Renamed corrupted category JPG: ${jpgPath} → ${backupPath}`);
  }
});

console.log("Done creating SVG placeholders for missing images!");
