// Asset configuration for React Native
// Images are imported statically as required by React Native

// Dinosaur images
const dinoImages = {
  tyrannosaurusRex: require('../../assets/dino/TyrannosaurusRex.png'),
  triceratops: require('../../assets/dino/Triceratops.png'),
  velociraptor: require('../../assets/dino/Velociraptor.png'),
  stegosaurus: require('../../assets/dino/Stegosaurus.png'),
  brachiosaurus: require('../../assets/dino/Brachiosaurus.png'),
  spinosaurus: require('../../assets/dino/Spinosaurus.png'),
  ankylosaurus: require('../../assets/dino/Ankylosaurus.png'),
  diplodocus: require('../../assets/dino/Diplodocus.png'),
  allosaurus: require('../../assets/dino/Allosaurus.png'),
  pteranodon: require('../../assets/dino/Pteranodon.png'),
};

// Fruit images
const fruitImages = {
  apple: require('../../assets/fruit/Apple.png'),
  banana: require('../../assets/fruit/Banana.png'),
  orange: require('../../assets/fruit/Orange.png'),
  grape: require('../../assets/fruit/Grape.png'),
  strawberry: require('../../assets/fruit/Strawberry.png'),
};

// Animal images
const animalImages = {
  lion: require('../../assets/animals/Lion.png'),
  elephant: require('../../assets/animals/Elephant.png'),
  tiger: require('../../assets/animals/Tiger.png'),
  giraffe: require('../../assets/animals/Giraffe.png'),
  panda: require('../../assets/animals/Panda.png'),
};

// Combined images object
export const images = {
  ...dinoImages,
  ...fruitImages,
  ...animalImages,
};

// Category preview images
export const categoryImages = {
  dinosaur: require('../../assets/dino/TyrannosaurusRex.png'),
  fruit: require('../../assets/fruit/Apple.png'),
  animals: require('../../assets/animals/Lion.png'),
};

// Helper function to get image by key
export const getImage = (imageKey) => {
  return images[imageKey] || null;
};

// Helper function to get category image
export const getCategoryImage = (category) => {
  return categoryImages[category.toLowerCase()] || null;
};

