const fs = require("fs");
const path = require("path");

// Define the files to update
const filesToUpdate = [
  path.join(__dirname, "../src/app/page.tsx"),
  path.join(__dirname, "../src/app/products/page.tsx"),
  path.join(__dirname, "../src/app/products/[id]/page.tsx"),
  path.join(__dirname, "../src/app/search/page.tsx"),
  path.join(__dirname, "../src/app/cart/page.tsx"),
  path.join(__dirname, "../src/app/account/orders/page.tsx"),
  path.join(__dirname, "../src/app/account/orders/[id]/page.tsx"),
  path.join(__dirname, "../src/app/account/wishlist/page.tsx"),
  path.join(__dirname, "../src/components/product/ProductCard.tsx"),
];

// Process each file
filesToUpdate.forEach((filePath) => {
  try {
    console.log(`Refactoring ${path.basename(filePath)}...`);

    // Read the file content
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    // Check if the file has the inline ImprovedImage component
    if (
      content.includes("// Improved Image component with better error handling")
    ) {
      console.log(
        `  Found inline ImprovedImage component in ${path.basename(filePath)}`
      );

      // Extract the start and end of the component
      const componentStartIndex = content.indexOf(
        "// Improved Image component"
      );
      const componentEndIndex = content.indexOf("};", componentStartIndex) + 2;

      if (componentStartIndex > -1 && componentEndIndex > componentStartIndex) {
        // Remove the component definition
        content =
          content.substring(0, componentStartIndex) +
          content.substring(componentEndIndex + 1);

        // Add the import if not already present
        if (
          !content.includes(
            'import ImprovedImage from "@/components/ui/ImprovedImage"'
          )
        ) {
          // Find the last import statement
          const lastImportIndex = content.lastIndexOf("import ");
          if (lastImportIndex > -1) {
            // Find the end of the last import statement
            let endOfImport = content.indexOf("\n", lastImportIndex);
            if (endOfImport === -1) endOfImport = content.length;

            // Insert our import after the last import
            content =
              content.substring(0, endOfImport) +
              '\nimport ImprovedImage from "@/components/ui/ImprovedImage";' +
              content.substring(endOfImport);
          }
        }

        updated = true;
      }
    }

    // Update the file if changes were made
    if (updated) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Refactored ${path.basename(filePath)}`);
    } else {
      console.log(`⏭️ No changes needed for ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(
      `❌ Error processing ${path.basename(filePath)}:`,
      error.message
    );
  }
});

console.log("Done refactoring image components!");

// Now let's add a checkout button to the cart page if it's not already present
try {
  const cartPagePath = path.join(__dirname, "../src/app/cart/page.tsx");
  let cartContent = fs.readFileSync(cartPagePath, "utf8");

  // Check if there's a checkout button
  if (
    !cartContent.includes('href="/checkout"') &&
    !cartContent.includes("Proceed to Checkout")
  ) {
    console.log("⚠️ Checkout button not found in cart page. Adding it...");

    // Find the fixed bottom section
    const fixedBottomIndex = cartContent.indexOf('className="fixed bottom-0');

    if (fixedBottomIndex > -1) {
      // Find the end of the div
      const endOfDiv = cartContent.indexOf("</div>", fixedBottomIndex);

      if (endOfDiv > -1) {
        // Add a checkout button
        const checkoutButtonCode = `
              <Link
                href="/checkout"
                className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg whitespace-nowrap"
              >
                Proceed to Checkout
              </Link>`;

        // Insert the button
        cartContent =
          cartContent.substring(0, endOfDiv) +
          checkoutButtonCode +
          cartContent.substring(endOfDiv);

        // Write the updated content back
        fs.writeFileSync(cartPagePath, cartContent, "utf8");
        console.log("✅ Added checkout button to cart page");
      }
    }
  } else {
    console.log("✓ Checkout button already exists in cart page");
  }
} catch (error) {
  console.error("❌ Error adding checkout button:", error.message);
}
