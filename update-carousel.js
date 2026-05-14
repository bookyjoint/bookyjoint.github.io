const fs = require('fs');
const path = require('path');

// Directory to scan for images
const imagesDir = path.join(__dirname, 'images');

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

// Function to check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

// Function to generate alt text from filename
function generateAltText(filename) {
  // Remove extension and replace underscores/hyphens with spaces
  const name = path.basename(filename, path.extname(filename));
  return name.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Read directory and filter images
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error reading images directory:', err);
    return;
  }

  // Filter for image files, excluding the manifest file itself
  const imageFiles = files
    .filter(file => isImageFile(file) && file !== 'carousel-manifest.json')
    .sort(); // Sort alphabetically

  // Create manifest entries
  const manifest = imageFiles.map(file => ({
    src: `images/${file}`,
    alt: generateAltText(file)
  }));

  // Write manifest file
  const manifestPath = path.join(imagesDir, 'carousel-manifest.json');
  fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), (err) => {
    if (err) {
      console.error('Error writing manifest file:', err);
      return;
    }
    console.log(`✅ Updated carousel-manifest.json with ${manifest.length} images:`);
    manifest.forEach(item => console.log(`   - ${item.src} (${item.alt})`));
  });
});