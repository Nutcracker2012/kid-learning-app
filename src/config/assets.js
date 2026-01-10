// Asset configuration
// Replace these URLs with actual asset paths once images are downloaded from Figma
// Images can be downloaded from Figma or replaced with your own assets

import volumeUpIcon from '../assets/icon/volume--up.svg'
import stopIcon from '../assets/icon/Stop.svg'

export const assets = {
  images: {
    // Card images - replace with actual paths or use Figma localhost URLs
    dinosaur: 'http://localhost:3845/assets/42e5cde04cc7830675286332b11936e0942d4b3e.png',
    fruit: 'http://localhost:3845/assets/3686c17a808316e2ccb0ceb2c089eb6b0f57587d.png',
    animals: 'http://localhost:3845/assets/ef10cddaf399b44e34e96632c14935c90efa8169.png',
    // Card full images - using local Dino folder images
    tyrannosaurusRex: '/src/assets/Dino/Tyrannosaurus Rex.png',
    allosaurus: '/src/assets/Dino/Allosaurus2.png',
    ankylosaurus: '/src/assets/Dino/Ankylosaurus.png',
    brachiosaurus: '/src/assets/Dino/Brachiosaurus2.png',
    diplodocus: '/src/assets/Dino/Diplodocus.png',
    iguanodon: '/src/assets/Dino/Iguanodon12.png',
    spinosaurus: '/src/assets/Dino/Spinosaurus2.png',
    stegosaurus: '/src/assets/Dino/StegosaurusT.png',
    triceratops: '/src/assets/Dino/Triceratops.png',
    velociraptor: '/src/assets/Dino/Velociraptor.png',
    pterodactyl: '/src/assets/Dino/Petrodactyl.png',
    // Fruit images
    apple: '/src/assets/fruit/Apple.png',
    banana: '/src/assets/fruit/Banana.png',
    cherry: '/src/assets/fruit/Cherry.png',
    grape: '/src/assets/fruit/Grape.png',
    mango: '/src/assets/fruit/Mango.png',
    orange: '/src/assets/fruit/Orange.png',
    peach: '/src/assets/fruit/Peach.png',
    pineapple: '/src/assets/fruit/Pineapple.png',
    strawberry: '/src/assets/fruit/Strawberry.png',
    watermelon: '/src/assets/fruit/Watermelon.png'
  },
  icons: {
    // SVG icons - these are included in the assets folder
    add: '/src/assets/add-icon.svg',
    search: '/src/assets/search-icon.svg',
    // Icon assets from Figma
    soundButton: 'http://localhost:3845/assets/a9f1006f91452d12f65312cc836fd21a5b74a1b9.svg',
    volumeUp: volumeUpIcon,
    stop: stopIcon,
    chevronRight: '/src/assets/icon/Chevron Icon.svg',
    arrowLeft: 'http://localhost:3845/assets/04824bebc15d0010e9c748cd85bd6116add0bbf5.svg'
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
