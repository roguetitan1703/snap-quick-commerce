const fs = require("fs");
const path = require("path");

// Define the files to update
const filesToUpdate = [
  path.join(__dirname, "../src/app/page.tsx"),
  path.join(__dirname, "../src/app/products/page.tsx"),
  path.join(__dirname, "../src/app/products/[id]/page.tsx"),
  path.join(__dirname, "../src/app/search/page.tsx"),
];

// Map of products to their local image paths
const productImageMap = {
  "Organic Bananas (6 pcs)": "/images/products/banana.jpg",
  "Fresh Milk 1L": "/images/products/milk.jpg",
  "Brown Eggs (6 pcs)": "/images/products/eggs.jpg",
  "Avocado (2 pcs)": "/images/products/avocado.jpg",
  "Greek Yogurt": "/images/products/yogurt.jpg",
  "Sourdough Bread": "/images/products/bread.svg",
  "Almond Milk 1L": "/images/products/almond-milk.svg",
  "Organic Spinach 250g": "/images/products/spinach.jpg",
  "Fresh Strawberries 250g": "/images/products/strawberries.svg",
  "Mixed Berries Pack": "/images/products/berries.svg",
  "Toilet Paper 6 Rolls": "/images/products/toilet-paper.svg",
  "Liquid Hand Soap 250ml": "/images/products/soap.svg",
  "Organic Vegetables Pack": "/images/products/vegetables.jpg",
};

// Map of categories to their local image paths
const categoryImageMap = {
  "Fruits & Vegetables": "/images/categories/fruits-vegetables.jpg",
  "Dairy & Eggs": "/images/categories/dairy-eggs.jpg",
  Snacks: "/images/categories/snacks.jpg",
  Beverages: "/images/categories/beverages.jpg",
  Bakery: "/images/categories/bakery.jpg",
  "Personal Care": "/images/categories/personal-care.jpg",
  "Home & Cleaning": "/images/categories/cleaning.jpg",
  "Baby Care": "/images/categories/baby-care.jpg",
};

// Process each file
filesToUpdate.forEach((filePath) => {
  try {
    console.log(`Processing ${path.basename(filePath)}...`);

    // Read the file content
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    // Replace product image URLs with local paths
    for (const [productName, localPath] of Object.entries(productImageMap)) {
      // Match product definitions with unsplash URLs
      const regex = new RegExp(
        `name: "${productName}",[\\s\\S]*?imageUrl:[\\s\\S]*?"https://images\\.unsplash\\.com/[^"]*"`,
        "g"
      );

      if (regex.test(content)) {
        content = content.replace(regex, (match) => {
          console.log(`  Updated image for ${productName}`);
          updated = true;
          return match.replace(
            /imageUrl:[\s\S]*?"https:\/\/images\.unsplash\.com\/[^"]*"/,
            `imageUrl: "${localPath}"`
          );
        });
      }
    }

    // Replace category image URLs with local paths
    for (const [categoryName, localPath] of Object.entries(categoryImageMap)) {
      // Match category definitions with unsplash URLs
      const regex = new RegExp(
        `name: "${categoryName}",[\\s\\S]*?imageUrl:[\\s\\S]*?"https://images\\.unsplash\\.com/[^"]*"`,
        "g"
      );

      if (regex.test(content)) {
        content = content.replace(regex, (match) => {
          console.log(`  Updated image for category ${categoryName}`);
          updated = true;
          return match.replace(
            /imageUrl:[\s\S]*?"https:\/\/images\.unsplash\.com\/[^"]*"/,
            `imageUrl: "${localPath}"`
          );
        });
      }
    }

    // Replace product images in arrays (like in product details page)
    if (filePath.includes("[id]/page.tsx")) {
      const imagesArrayRegex =
        /images: \[\s*"https:\/\/images\.unsplash\.com\/[^"]*"(?:,\s*"https:\/\/images\.unsplash\.com\/[^"]*")*\s*\]/g;

      if (imagesArrayRegex.test(content)) {
        content = content.replace(imagesArrayRegex, (match) => {
          console.log("  Updated product image array");
          updated = true;

          // For product details page, set multiple product images
          if (content.includes("Organic Bananas")) {
            return 'images: ["/images/products/banana.jpg", "/images/products/banana.jpg", "/images/products/banana.jpg"]';
          } else {
            return 'images: ["/images/placeholder-product.svg", "/images/placeholder-product.svg"]';
          }
        });
      }
    }

    // Add error handling to all Image components
    const imageComponentRegex =
      /<Image\s+src={[^}]+}\s+alt={[^}]+}\s+fill[\s\S]*?(?:\/>|<\/Image>)/g;

    content = content.replace(imageComponentRegex, (match) => {
      if (!match.includes("onError")) {
        updated = true;
        // Insert onError handler before the closing tag
        return match.replace(
          /(\s*)(?:\/>|<\/Image>)/,
          `$1  onError={(e) => {
$1    const target = e.target as HTMLImageElement;
$1    target.src = "/images/placeholder-product.svg";
$1  }}$&`
        );
      }
      return match;
    });

    // Update the file if changes were made
    if (updated) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated ${path.basename(filePath)}`);
    } else {
      console.log(`⏭️ No updates needed for ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(
      `❌ Error processing ${path.basename(filePath)}:`,
      error.message
    );
  }
});

console.log("Done updating image paths!");
