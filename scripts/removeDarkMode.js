const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

// Promisified versions of fs functions
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

// Extensions to check
const extensions = [".tsx", ".jsx", ".ts", ".js"];

// Pattern to match dark: classes
const darkClassPattern = /dark:/g;

// Function to walk directory recursively
async function walk(dir) {
  const files = await readdir(dir);
  const results = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file === "node_modules" || file === ".next") continue;
      results.push(...(await walk(filePath)));
    } else if (extensions.includes(path.extname(file))) {
      results.push(filePath);
    }
  }

  return results;
}

// Function to check file for dark: classes
async function checkFile(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    const matches = content.match(darkClassPattern);

    if (matches) {
      console.log(`${filePath}: ${matches.length} dark: classes found`);
      return { filePath, count: matches.length };
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return null;
}

// Main function
async function main() {
  try {
    const srcDir = path.resolve(__dirname, "../src");
    const files = await walk(srcDir);

    console.log(`Checking ${files.length} files for dark: classes...`);

    const results = [];
    for (const file of files) {
      const result = await checkFile(file);
      if (result) results.push(result);
    }

    results.sort((a, b) => b.count - a.count);

    console.log("\nSummary:");
    console.log(`${results.length} files contain dark: classes`);
    console.log(
      `Total dark: classes: ${results.reduce(
        (sum, file) => sum + file.count,
        0
      )}`
    );
    console.log("\nFiles with the most dark: classes:");
    results.slice(0, 10).forEach(({ filePath, count }) => {
      console.log(`${filePath}: ${count} dark: classes`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
