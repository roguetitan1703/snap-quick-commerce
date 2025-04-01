const fs = require("fs");
const path = require("path");

// Define the file to update
const wishlistFile = path.join(
  __dirname,
  "../src/app/account/wishlist/page.tsx"
);

// Define the product names and their corresponding image paths
const productImageMap = {
  "Organic Bananas (6 pcs)": "/images/products/banana.jpg",
  "Fresh Milk 1L": "/images/products/milk.jpg",
  "Brown Eggs (6 pcs)": "/images/products/eggs.jpg",
  "Avocado (2 pcs)": "/images/products/avocado.jpg",
};

try {
  // Read the file
  let content = fs.readFileSync(wishlistFile, "utf8");

  // Find the wishlistItems array
  const wishlistItemsRegex = /(const wishlistItems = \[[\s\S]*?\];)/;
  const wishlistItemsMatch = content.match(wishlistItemsRegex);

  if (!wishlistItemsMatch) {
    console.error("Could not find wishlistItems array in the file.");
    process.exit(1);
  }

  let wishlistItemsString = wishlistItemsMatch[1];
  let updated = false;

  // Update each product's image path
  for (const [productName, imagePath] of Object.entries(productImageMap)) {
    const productRegex = new RegExp(
      `name: "${productName}",[\\s\\S]*?image:[\\s\\S]*?"([^"]*)"`,
      "g"
    );

    if (productRegex.test(wishlistItemsString)) {
      wishlistItemsString = wishlistItemsString.replace(
        productRegex,
        (match, oldPath) => {
          console.log(
            `Updating ${productName} from ${oldPath} to ${imagePath}`
          );
          updated = true;
          return match.replace(`"${oldPath}"`, `"${imagePath}"`);
        }
      );
    }
  }

  if (updated) {
    // Replace the old wishlistItems array with the updated one
    content = content.replace(wishlistItemsRegex, wishlistItemsString);
    fs.writeFileSync(wishlistFile, content, "utf8");
    console.log("Wishlist file updated successfully.");
  } else {
    console.log("No updates needed for wishlist file.");
  }
} catch (error) {
  console.error("Error updating wishlist file:", error.message);
}
