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

// Update the "vegetables.jpg" to use SVG instead
const imagesToReplace = {
  "/images/products/vegetables.jpg": "/images/products/vegetables.svg",
};

// Create a reusable ImageComponent with improved error handling
const improvedImageComponent = `
// Improved Image component with better error handling to prevent continuous refetching
const ImprovedImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [error, setError] = React.useState(false);

  // Reset error state if src changes
  React.useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={!error ? imgSrc : "/images/placeholder-product.svg"}
      alt={alt}
      onError={(e) => {
        // Prevent continuous retries
        if (!error) {
          console.error(\`Failed to load image: \${imgSrc}\`);
          setError(true);
          setImgSrc("/images/placeholder-product.svg");
        }
      }}
    />
  );
};`;

// Process each file
filesToUpdate.forEach((filePath) => {
  try {
    console.log(`Processing ${path.basename(filePath)}...`);

    // Read the file content
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    // Replace problematic image paths
    for (const [oldPath, newPath] of Object.entries(imagesToReplace)) {
      const regex = new RegExp(oldPath.replace(/\//g, "\\/"), "g");
      if (regex.test(content)) {
        content = content.replace(regex, newPath);
        console.log(`  Replaced ${oldPath} with ${newPath}`);
        updated = true;
      }
    }

    // Add the improved image component if not already present
    if (
      !content.includes("ImprovedImage") &&
      (filePath.includes("page.tsx") || filePath.includes("ProductCard.tsx"))
    ) {
      // Find a good location to insert the component - after imports
      const importEndIndex = content.lastIndexOf("import") + 1;
      if (importEndIndex > 1) {
        // Find the end of the import block
        const afterImports = content.substring(importEndIndex);
        const nextLineBreak = afterImports.indexOf("\n");

        if (nextLineBreak > -1) {
          const insertPosition = importEndIndex + nextLineBreak + 1;
          content =
            content.substring(0, insertPosition) +
            improvedImageComponent +
            "\n\n" +
            content.substring(insertPosition);
          console.log("  Added improved image component");
          updated = true;
        }
      }
    }

    // Replace direct Image components with ImprovedImage
    if (content.includes("ImprovedImage")) {
      // Replace standard Image usage with ImprovedImage
      const imageComponentRegex = /<Image\s+([^>]*?)src={([^}]+)}([^>]*?)>/g;
      content = content.replace(
        imageComponentRegex,
        (match, beforeSrc, srcValue, afterSrc) => {
          // Only replace if not already using ImprovedImage
          if (!match.includes("onError") || match.includes("continuous")) {
            return `<ImprovedImage ${beforeSrc}src={${srcValue}}${afterSrc}>`;
          }
          return match;
        }
      );

      console.log("  Updated Image components to use ImprovedImage");
      updated = true;
    } else {
      // If we didn't add the ImprovedImage component, replace the onError handlers
      const errorHandlerRegex = /onError={\([^}]+\)\s*=>\s*{[^}]+}}/g;
      content = content.replace(errorHandlerRegex, (match) => {
        if (!match.includes("setError")) {
          return `onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Store the error state to prevent continuous retries
            const errorKey = \`error_\${target.src}\`;
            if (!target.dataset[errorKey]) {
              console.error(\`Failed to load image: \${target.src}\`);
              target.dataset[errorKey] = "true";
              target.src = "/images/placeholder-product.svg";
            }
          }}`;
        }
        return match;
      });

      console.log("  Updated error handlers to prevent continuous retries");
      updated = true;
    }

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

console.log("Done improving image loading behavior!");
