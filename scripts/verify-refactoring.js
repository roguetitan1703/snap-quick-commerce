const fs = require("fs");
const path = require("path");

// Define the files to check
const filesToCheck = [
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

console.log("Verifying refactoring status...");

const results = {
  correctImport: 0,
  missingImport: 0,
  inlineComponent: 0,
  usesImprovedImage: 0,
  doesNotUseImprovedImage: 0,
};

// Process each file
filesToCheck.forEach((filePath) => {
  try {
    const filename = path.basename(filePath);
    console.log(`\nChecking ${filename}...`);

    // Read the file content
    const content = fs.readFileSync(filePath, "utf8");

    // Check if the file imports the component correctly
    if (
      content.includes(
        'import ImprovedImage from "@/components/ui/ImprovedImage"'
      )
    ) {
      console.log(
        `✅ ${filename} correctly imports the centralized ImprovedImage component`
      );
      results.correctImport++;
    } else if (content.includes("<ImprovedImage")) {
      console.log(
        `❌ ${filename} uses ImprovedImage but doesn't import it correctly`
      );
      results.missingImport++;
    }

    // Check if the file still has an inline implementation
    if (
      content.includes("// Improved Image component with better error handling")
    ) {
      console.log(
        `⚠️ ${filename} still contains an inline ImprovedImage component`
      );
      results.inlineComponent++;
    }

    // Check if the file uses ImprovedImage
    if (content.includes("<ImprovedImage")) {
      console.log(`✓ ${filename} uses the ImprovedImage component`);
      results.usesImprovedImage++;
    } else if (content.includes("<Image")) {
      console.log(
        `ℹ️ ${filename} uses the standard Image component but not ImprovedImage`
      );
      results.doesNotUseImprovedImage++;
    }
  } catch (error) {
    console.error(
      `❌ Error processing ${path.basename(filePath)}:`,
      error.message
    );
  }
});

// Print summary
console.log("\n=== REFACTORING SUMMARY ===");
console.log(`✅ Files with correct imports: ${results.correctImport}`);
console.log(`❌ Files with missing imports: ${results.missingImport}`);
console.log(`⚠️ Files with inline components: ${results.inlineComponent}`);
console.log(`✓ Files using ImprovedImage: ${results.usesImprovedImage}`);
console.log(
  `ℹ️ Files not using ImprovedImage: ${results.doesNotUseImprovedImage}`
);

console.log("\nDone verifying refactoring status!");
