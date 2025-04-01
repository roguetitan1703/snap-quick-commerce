const fs = require("fs");
const path = require("path");

// Define the files to update
const filesToUpdate = [
  path.join(__dirname, "../src/app/account/orders/[id]/page.tsx"),
  path.join(__dirname, "../src/app/account/orders/page.tsx"),
];

// Define the product names and their corresponding image paths
const productImageMap = {
  "Organic Bananas": "/images/products/banana.jpg",
  "Fresh Milk 1L": "/images/products/milk.jpg",
  "Avocado (2 pcs)": "/images/products/avocado.jpg",
  "Brown Eggs (6 pcs)": "/images/products/eggs.jpg",
  "Sourdough Bread": "/images/products/bread.svg",
  "Greek Yogurt": "/images/products/yogurt.jpg",
  "Almond Milk 1L": "/images/products/almond-milk.svg",
  "Organic Spinach 250g": "/images/products/spinach.jpg",
  "Mixed Berries Pack": "/images/products/berries.svg",
  "Toilet Paper 6 Rolls": "/images/products/toilet-paper.svg",
  "Liquid Hand Soap 250ml": "/images/products/soap.svg",
};

// Function to update image paths in a file
function updateImagePaths(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    // Replace image paths for each product
    for (const [productName, imagePath] of Object.entries(productImageMap)) {
      const regex = new RegExp(
        `name: "${productName}",[\\s\\S]*?image: "[^"]*"`,
        "g"
      );
      const replacement = `name: "${productName}",\\n          price: [\\d\\.]+,[\\n\\s]*quantity: \\d+,[\\n\\s]*image: "${imagePath}"`;

      if (regex.test(content)) {
        content = content.replace(regex, (match) => {
          console.log(
            `Updated ${productName} with ${imagePath} in ${path.basename(
              filePath
            )}`
          );
          updated = true;
          return match.replace(/image: "[^"]*"/, `image: "${imagePath}"`);
        });
      }
    }

    // Write the updated content back to the file
    if (updated) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated ${path.basename(filePath)}`);
    } else {
      console.log(`No updates needed for ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Update all files
filesToUpdate.forEach(updateImagePaths);

console.log("Done updating image paths!");
