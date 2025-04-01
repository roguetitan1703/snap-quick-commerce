const fs = require("fs");
const path = require("path");

// Define the files to update
const filesToUpdate = [
  path.join(__dirname, "../src/app/page.tsx"),
  path.join(__dirname, "../src/app/products/page.tsx"),
  path.join(__dirname, "../src/app/products/[id]/page.tsx"),
  path.join(__dirname, "../src/app/cart/page.tsx"),
  path.join(__dirname, "../src/app/account/orders/page.tsx"),
  path.join(__dirname, "../src/app/account/orders/[id]/page.tsx"),
  path.join(__dirname, "../src/app/account/wishlist/page.tsx"),
  path.join(__dirname, "../src/components/product/ProductCard.tsx"),
];

console.log("Updating standard Image components to use ImprovedImage...");

// Process each file
filesToUpdate.forEach((filePath) => {
  try {
    const filename = path.basename(filePath);
    console.log(`\nProcessing ${filename}...`);

    // Read the file content
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    // Check if the file already imports ImprovedImage
    if (
      !content.includes(
        'import ImprovedImage from "@/components/ui/ImprovedImage"'
      )
    ) {
      // Add the import
      const importSectionEnd = content.lastIndexOf("import ");
      if (importSectionEnd > -1) {
        const nextLine = content.indexOf("\n", importSectionEnd);
        content =
          content.substring(0, nextLine) +
          '\nimport ImprovedImage from "@/components/ui/ImprovedImage";' +
          content.substring(nextLine);
        updated = true;
        console.log(`  Added ImprovedImage import to ${filename}`);
      }
    }

    // Find Image components with src attribute and replace them with ImprovedImage
    // but not if they're already part of an ImprovedImage component
    const imageRegex =
      /<Image\s+([^>]*?)src=\{([^}]+)\}([^>]*?)(?:\/>|>\s*<\/Image>)/g;
    let match;
    let newContent = content;
    let replacementCount = 0;

    // Extract sections surrounding ImprovedImage components to avoid replacing them
    const improvedImageSections = [];
    const improvedRegex = /<ImprovedImage[\s\S]*?(?:\/>|<\/ImprovedImage>)/g;
    while ((match = improvedRegex.exec(content)) !== null) {
      improvedImageSections.push({
        start: Math.max(0, match.index - 20),
        end: match.index + match[0].length + 20,
      });
    }

    // Replace standard Image components
    while ((match = imageRegex.exec(content)) !== null) {
      // Check if this match is part of an ImprovedImage section (to avoid)
      const isInImprovedSection = improvedImageSections.some(
        (section) => match.index >= section.start && match.index <= section.end
      );

      if (!isInImprovedSection) {
        const fullMatch = match[0];
        const beforeSrc = match[1] || "";
        const srcValue = match[2];
        const afterSrc = match[3] || "";

        // Create the replacement with ImprovedImage
        const replacement = `<ImprovedImage ${beforeSrc}src={${srcValue}}${afterSrc}${
          fullMatch.endsWith("/>") ? "/>" : "></ImprovedImage>"
        }`;

        // Replace just this occurrence
        newContent =
          newContent.substring(0, match.index) +
          replacement +
          newContent.substring(match.index + fullMatch.length);

        replacementCount++;
      }
    }

    if (replacementCount > 0) {
      content = newContent;
      updated = true;
      console.log(
        `  Replaced ${replacementCount} standard Image components with ImprovedImage`
      );
    }

    // Write updated content back to file
    if (updated) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated ${filename}`);
    } else {
      console.log(`⏭️ No changes needed for ${filename}`);
    }
  } catch (error) {
    console.error(
      `❌ Error processing ${path.basename(filePath)}:`,
      error.message
    );
  }
});

console.log("\nDone updating Image components!");
