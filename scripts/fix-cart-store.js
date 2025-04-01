const fs = require("fs");
const path = require("path");

// Define the file to update
const cartStoreFile = path.join(__dirname, "../src/store/cartStore.ts");

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
  "Mixed Berries Pack": "/images/products/berries.svg",
  "Toilet Paper 6 Rolls": "/images/products/toilet-paper.svg",
  "Liquid Hand Soap 250ml": "/images/products/soap.svg",
};

console.log(`Processing cart store at ${cartStoreFile}...`);

try {
  // Read the content of the file
  let content = fs.readFileSync(cartStoreFile, "utf8");
  console.log("Successfully read file content");

  // Check if our helper function already exists
  if (content.includes("getLocalImagePath")) {
    console.log("Helper function already exists, skipping addition");
  } else {
    // Function to get the correct local image path
    const getLocalImageHelperFunction = `
// Helper function to ensure we're using local image paths
const getLocalImagePath = (productName: string, externalUrl: string): string => {
  // Map common product names to local image paths
  const imageMap: Record<string, string> = {
    'Organic Bananas (6 pcs)': '/images/products/banana.jpg',
    'Fresh Milk 1L': '/images/products/milk.jpg',
    'Brown Eggs (6 pcs)': '/images/products/eggs.jpg',
    'Avocado (2 pcs)': '/images/products/avocado.jpg',
    'Greek Yogurt': '/images/products/yogurt.jpg',
    'Sourdough Bread': '/images/products/bread.svg',
    'Almond Milk 1L': '/images/products/almond-milk.svg',
    'Organic Spinach 250g': '/images/products/spinach.jpg',
    'Mixed Berries Pack': '/images/products/berries.svg',
    'Toilet Paper 6 Rolls': '/images/products/toilet-paper.svg',
    'Liquid Hand Soap 250ml': '/images/products/soap.svg'
  };

  // If the product name is in our map, use the local path
  if (imageMap[productName]) {
    return imageMap[productName];
  }

  // If the URL is already a local path, return it
  if (externalUrl.startsWith('/images/')) {
    return externalUrl;
  }

  // Default to placeholder for external URLs
  return '/images/placeholder-product.svg';
};`;

    // Add the helper function after the imports
    console.log("Adding helper function to ensure local image paths");
    const importEndIndex = content.indexOf("export interface CartItem");
    if (importEndIndex > 0) {
      content =
        content.substring(0, importEndIndex) +
        getLocalImageHelperFunction +
        "\n\n" +
        content.substring(importEndIndex);
    } else {
      console.log("Could not find proper insertion point for helper function");
    }
  }

  // Check if addItem function already includes our local image handling
  if (content.includes("getLocalImagePath(newItem.name")) {
    console.log(
      "addItem function already includes local image handling, skipping modification"
    );
  } else {
    console.log("Updating addItem function to ensure local image paths");

    // Modified addItem function that ensures local image paths
    const modifiedAddItemFunction = `
      addItem: (newItem) => {
        // Ensure we're using local image paths
        const localImageUrl = getLocalImagePath(newItem.name, newItem.imageUrl);
        const itemWithLocalImage = {
          ...newItem,
          imageUrl: localImageUrl
        };

        set((state) => {
          // Check if the item already exists in the cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === itemWithLocalImage.productId
          );

          if (existingItemIndex >= 0) {
            // Update the quantity of the existing item
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = Math.min(
              existingItem.quantity + itemWithLocalImage.quantity,
              existingItem.maxQuantity
            );
            
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
            
            return { items: updatedItems };
          } else {
            // Add the new item to the cart
            return { items: [...state.items, itemWithLocalImage] };
          }
        });
      },`;

    // Replace the addItem function
    const addItemRegex =
      /addItem: \(newItem\) => {[\s\S]*?},\s*\n\s*decrementItem/;
    if (addItemRegex.test(content)) {
      content = content.replace(
        addItemRegex,
        modifiedAddItemFunction + "\n      decrementItem"
      );
      console.log("Successfully replaced addItem function");
    } else {
      console.log("Could not find addItem function pattern to replace");
    }
  }

  // Write the updated content back to the file
  fs.writeFileSync(cartStoreFile, content, "utf8");
  console.log("Successfully wrote updated content back to file");
  console.log(
    "Cart store file updated successfully with local image path handling."
  );
} catch (error) {
  console.error("Error updating cart store file:", error);
}
