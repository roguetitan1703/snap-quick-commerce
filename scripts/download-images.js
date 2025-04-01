const https = require("https");
const fs = require("fs");
const path = require("path");

// Create the images directory if it doesn't exist
const imagesDir = path.join(__dirname, "../public/images/products");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Created directory: ${imagesDir}`);
}

// List of Unsplash image URLs and their target filenames
const imagesToDownload = [
  {
    url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60",
    filename: "banana.jpg",
    productName: "Organic Bananas",
  },
  {
    url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60",
    filename: "milk.jpg",
    productName: "Fresh Milk",
  },
  {
    url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60",
    filename: "avocado.jpg",
    productName: "Avocado",
  },
  {
    url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=60",
    filename: "eggs.jpg",
    productName: "Brown Eggs",
  },
  {
    url: "https://images.unsplash.com/photo-1585478259715-47ffb9dd29e4?w=500&auto=format&fit=crop&q=60",
    filename: "bread.jpg",
    productName: "Sourdough Bread",
  },
  {
    url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60",
    filename: "yogurt.jpg",
    productName: "Greek Yogurt",
  },
  {
    url: "https://images.unsplash.com/photo-1608584617901-d9396302e5d4?w=500&auto=format&fit=crop&q=60",
    filename: "almond-milk.jpg",
    productName: "Almond Milk",
  },
  {
    url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60",
    filename: "spinach.jpg",
    productName: "Organic Spinach",
  },
  {
    url: "https://images.unsplash.com/photo-1563746924237-f4471479790f?w=500&auto=format&fit=crop&q=60",
    filename: "berries.jpg",
    productName: "Mixed Berries",
  },
  {
    url: "https://images.unsplash.com/photo-1583856402225-2a4e65c711a2?w=500&auto=format&fit=crop&q=60",
    filename: "toilet-paper.jpg",
    productName: "Toilet Paper",
  },
  {
    url: "https://images.unsplash.com/photo-1583106567711-c5683d4be86f?w=500&auto=format&fit=crop&q=60",
    filename: "soap.jpg",
    productName: "Liquid Hand Soap",
  },
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);

    // Create a writable stream to save the file
    const fileStream = fs.createWriteStream(filePath);

    // Download the image
    https
      .get(url, (response) => {
        // Check if the response is successful
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`)
          );
          return;
        }

        // Pipe the response data to the file
        response.pipe(fileStream);

        // Handle file stream events
        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve(filePath);
        });

        fileStream.on("error", (err) => {
          fs.unlink(filePath, () => {}); // Delete the file if there's an error
          reject(err);
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there's an error
        reject(err);
      });
  });
}

// Download all images
async function downloadAllImages() {
  console.log("Starting download of Unsplash images...");

  const promises = imagesToDownload.map((image) => {
    return downloadImage(image.url, image.filename)
      .then(() => ({ success: true, image }))
      .catch((error) => {
        console.error(`Error downloading ${image.filename}: ${error.message}`);
        return { success: false, image, error };
      });
  });

  const results = await Promise.all(promises);

  // Summary
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\nDownload Summary:`);
  console.log(`- Successfully downloaded: ${successful.length} images`);
  console.log(`- Failed to download: ${failed.length} images`);

  if (successful.length > 0) {
    console.log("\nSuccessfully downloaded images:");
    successful.forEach((r) =>
      console.log(`- ${r.image.productName} (${r.image.filename})`)
    );
  }

  if (failed.length > 0) {
    console.log("\nFailed to download images:");
    failed.forEach((r) =>
      console.log(`- ${r.image.productName} (${r.image.filename})`)
    );
  }

  // Generate code to update the image paths
  console.log("\nUpdate your image paths in the code using:");
  successful.forEach((r) => {
    console.log(`image: "/images/products/${r.image.filename}",`);
  });
}

// Run the download
downloadAllImages().catch((err) => {
  console.error("An error occurred:", err);
});
