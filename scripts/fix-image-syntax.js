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

// Process each file
filesToCheck.forEach((filePath) => {
  try {
    console.log(`Checking ${path.basename(filePath)} for syntax errors...`);

    // Read the file content
    const content = fs.readFileSync(filePath, "utf8");

    // Check if the file has the ImprovedImage component
    if (content.includes("ImprovedImage")) {
      console.log(
        `Found ImprovedImage component in ${path.basename(filePath)}`
      );

      // Check for broken imports
      if (
        content.includes('from "react-icons/fi";') &&
        content.includes("FiSearch") &&
        content.indexOf("ImprovedImage") <
          content.indexOf('from "react-icons/fi";')
      ) {
        console.log(
          `⚠️ Import section broken in ${path.basename(filePath)} - fixing...`
        );

        // Extract the complete imports section
        const importsEndIndex =
          content.indexOf('from "react-icons/fi";') +
          'from "react-icons/fi";'.length;
        let importsSection = content.substring(0, importsEndIndex);

        // Extract the ImprovedImage component
        const improvedImageStartIndex = content.indexOf(
          "// Improved Image component"
        );
        const improvedImageEndIndex =
          content.indexOf("};", improvedImageStartIndex) + 2;
        const improvedImageComponent = content.substring(
          improvedImageStartIndex,
          improvedImageEndIndex
        );

        // Remove the ImprovedImage component from its incorrect position
        const cleanedImportsSection = importsSection.replace(
          improvedImageComponent,
          ""
        );

        // Rebuild the file content with correct order
        const contentAfterImports = content.substring(importsEndIndex);
        const fixedContent =
          cleanedImportsSection +
          "\n\n" +
          improvedImageComponent +
          "\n\n" +
          contentAfterImports.replace(improvedImageComponent, "");

        // Write the fixed content back to the file
        fs.writeFileSync(filePath, fixedContent, "utf8");
        console.log(`✅ Fixed syntax in ${path.basename(filePath)}`);
      }
    }
  } catch (error) {
    console.error(
      `❌ Error processing ${path.basename(filePath)}:`,
      error.message
    );
  }
});

console.log("Done checking for syntax errors!");
