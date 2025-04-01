const fs = require("fs");
const path = require("path");

// Define the file to update
const cartFile = path.join(__dirname, "../src/app/cart/page.tsx");

// Map of products to their local image paths
const productImageMap = {
  "Organic Bananas (6 pcs)": "/images/products/banana.jpg",
  "Fresh Milk 1L": "/images/products/milk.jpg",
  "Brown Eggs (6 pcs)": "/images/products/eggs.jpg",
  "Avocado (2 pcs)": "/images/products/avocado.jpg",
  "Greek Yogurt": "/images/products/yogurt.jpg",
};

try {
  // Read the content of the file
  let content = fs.readFileSync(cartFile, "utf8");
  let updated = false;

  // Update recommended products section
  const recommendedProductsRegex =
    /const recommendedProducts = \[\s*{[\s\S]*?}\s*,\s*{[\s\S]*?}\s*\];/g;
  const recommendedProductsMatch = content.match(recommendedProductsRegex);

  if (recommendedProductsMatch) {
    const recommendedProductsString = recommendedProductsMatch[0];

    // Update image paths in the recommended products
    let updatedRecommendedProducts = recommendedProductsString.replace(
      /imageUrl:\s*"https:\/\/images\.unsplash\.com\/[^"]+"/g,
      (match, offset, string) => {
        // Determine which product we're dealing with
        const productSection = string.substring(
          Math.max(0, offset - 100),
          offset + match.length
        );

        if (productSection.includes("Avocado (2 pcs)")) {
          return 'imageUrl: "/images/products/avocado.jpg"';
        } else if (productSection.includes("Greek Yogurt")) {
          return 'imageUrl: "/images/products/yogurt.jpg"';
        }

        // Default to placeholder if we can't determine the product
        return 'imageUrl: "/images/placeholder-product.svg"';
      }
    );

    content = content.replace(
      recommendedProductsString,
      updatedRecommendedProducts
    );
    updated = true;
  }

  // Update cart items section to ensure it uses the correct image component with error handling
  const imageComponentRegex = /src={item\.imageUrl}/g;
  if (content.match(imageComponentRegex)) {
    // Replace the Image component with one that has error handling
    content = content.replace(
      /<Image\s+src={item\.imageUrl}\s+alt={item\.name}\s+width={80}\s+height={80}\s+className="h-full w-full object-cover"\s+\/>/g,
      `<Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder-product.svg";
                          }}
                        />`
    );
    updated = true;
  }

  // Write the updated content back to the file if changes were made
  if (updated) {
    fs.writeFileSync(cartFile, content);
    console.log(
      "Cart file updated successfully with local image paths and error handling."
    );
  } else {
    console.log("No updates were needed or could be applied to the cart file.");
  }
} catch (error) {
  console.error("Error updating cart file:", error);
}
