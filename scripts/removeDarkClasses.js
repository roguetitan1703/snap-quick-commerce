const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

// Promisified versions of fs functions
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Extensions to check
const extensions = [".tsx", ".jsx", ".ts", ".js"];

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

// Function to remove dark mode classes from a file
async function removeDarkClasses(filePath) {
  try {
    let content = await readFile(filePath, "utf8");

    // Count original dark: classes
    const originalMatches = (content.match(/dark:/g) || []).length;

    if (originalMatches === 0) return { filePath, changed: false, count: 0 };

    // Replace dark: classes in className attributes
    const newContent = content.replace(/(\s)dark:[^\s"']+/g, "");

    // Count remaining dark: classes
    const remainingMatches = (newContent.match(/dark:/g) || []).length;
    const removedCount = originalMatches - remainingMatches;

    // Only write file if changes were made
    if (removedCount > 0) {
      await writeFile(filePath, newContent, "utf8");
      return { filePath, changed: true, count: removedCount };
    }

    return { filePath, changed: false, count: 0 };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { filePath, changed: false, count: 0, error };
  }
}

// Main function
async function main() {
  try {
    const srcDir = path.resolve(__dirname, "../src");
    const files = await walk(srcDir);

    console.log(`Processing ${files.length} files...`);

    const results = [];
    for (const file of files) {
      const result = await removeDarkClasses(file);
      if (result.changed) {
        console.log(`${file}: Removed ${result.count} dark: classes`);
        results.push(result);
      }
    }

    console.log("\nSummary:");
    console.log(`Modified ${results.length} files`);
    console.log(
      `Removed ${results.reduce(
        (sum, file) => sum + file.count,
        0
      )} dark: classes`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
