// Asset configuration
// Replace these URLs with actual asset paths once images are downloaded from Figma
// Images can be downloaded from Figma or replaced with your own assets

export const assets = {
  images: {
    // Card images - replace with actual paths or use Figma localhost URLs
    dinosaur: 'http://localhost:3845/assets/42e5cde04cc7830675286332b11936e0942d4b3e.png',
    fruit: 'http://localhost:3845/assets/3686c17a808316e2ccb0ceb2c089eb6b0f57587d.png',
    animals: 'http://localhost:3845/assets/ef10cddaf399b44e34e96632c14935c90efa8169.png'
  },
  icons: {
    // SVG icons - these are included in the assets folder
    add: '/src/assets/add-icon.svg',
    search: '/src/assets/search-icon.svg'
  }
}

// Helper function to get image URL
export const getImageUrl = (imageName) => {
  // Return image URL from assets configuration
  return assets.images[imageName] || null
}
