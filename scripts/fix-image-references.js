const fs = require("fs");
const path = require("path");

// Path to the src directory
const srcDir = path.join(__dirname, "../src");

// Define the product image mappings - check for missing JPG files and use SVG instead
const productImageMap = {
  strawberries: {
    pattern: /\/images\/products\/strawberries\.jpg/g,
    replacement: "/images/products/strawberries.svg",
  },
  berries: {
    pattern: /\/images\/products\/berries\.jpg/g,
    replacement: "/images/products/berries.svg",
  },
  bread: {
    pattern: /\/images\/products\/bread\.jpg/g,
    replacement: "/images/products/bread.svg",
  },
  "almond-milk": {
    pattern: /\/images\/products\/almond-milk\.jpg/g,
    replacement: "/images/products/almond-milk.svg",
  },
  soap: {
    pattern: /\/images\/products\/soap\.jpg/g,
    replacement: "/images/products/soap.svg",
  },
  "toilet-paper": {
    pattern: /\/images\/products\/toilet-paper\.jpg/g,
    replacement: "/images/products/toilet-paper.svg",
  },
};

// Function to recursively find all tsx and jsx files
function findReactFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findReactFiles(filePath, fileList);
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Find all React files
const reactFiles = findReactFiles(srcDir);
console.log(`Found ${reactFiles.length} React files to check`);

// Process each file
let totalReplacements = 0;
let totalFilesChanged = 0;

reactFiles.forEach((filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  let fileChanged = false;
  let fileReplacements = 0;

  // Apply each replacement
  Object.keys(productImageMap).forEach((product) => {
    const { pattern, replacement } = productImageMap[product];

    // Check if the pattern exists in the file
    if (pattern.test(content)) {
      // Count matches before replacement
      const matches = content.match(pattern);
      const matchCount = matches ? matches.length : 0;

      // Apply replacement
      const newContent = content.replace(pattern, replacement);

      if (newContent !== content) {
        content = newContent;
        fileChanged = true;
        fileReplacements += matchCount;
        console.log(
          `  - Replaced ${matchCount} occurrences of ${product} image in ${path.relative(
            process.cwd(),
            filePath
          )}`
        );
      }
    }
  });

  // Save the file if changed
  if (fileChanged) {
    fs.writeFileSync(filePath, content, "utf8");
    totalFilesChanged++;
    totalReplacements += fileReplacements;
  }
});

console.log(`\nOperation complete!`);
console.log(`- Changed ${totalFilesChanged} files`);
console.log(`- Made ${totalReplacements} image path replacements`);
console.log(`- All missing JPG images now use SVG versions instead`);
