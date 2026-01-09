// Asset configuration
// Replace these URLs with actual asset paths once images are downloaded from Figma
// Images can be downloaded from Figma or replaced with your own assets

export const assets = {
  images: {
    // Card images - replace with actual paths or use Figma localhost URLs
    dinosaur: 'http://localhost:3845/assets/42e5cde04cc7830675286332b11936e0942d4b3e.png',
    fruit: 'http://localhost:3845/assets/3686c17a808316e2ccb0ceb2c089eb6b0f57587d.png',
    animals: 'http://localhost:3845/assets/ef10cddaf399b44e34e96632c14935c90efa8169.png',
    // Card full images
    tyrannosaurusRex: 'http://localhost:3845/assets/3f2fa0bc13917a29216760503470d239af2c3547.png',
    tyrannosaurusRex2: 'http://localhost:3845/assets/979106f33ee442f6264b0d1ecf0624aa098b25c2.png'
  },
  icons: {
    // SVG icons - these are included in the assets folder
    add: '/src/assets/add-icon.svg',
    search: '/src/assets/search-icon.svg',
    // Icon assets from Figma
    soundButton: 'http://localhost:3845/assets/a9f1006f91452d12f65312cc836fd21a5b74a1b9.svg',
    volumeUp: 'http://localhost:3845/assets/103c3cd39192edf96037acca1b494c428aa6f973.svg',
    chevronRight: 'http://localhost:3845/assets/768dc5aa18a36a5f4fed35b595fc18e21645969e.svg'
  }
}

// Helper function to get image URL
export const getImageUrl = (imageName) => {
  // Return image URL from assets configuration
  return assets.images[imageName] || null
}

// Helper function to get icon URL
export const getIconUrl = (iconName) => {
  // Return icon URL from assets configuration
  return assets.icons[iconName] || null
}
