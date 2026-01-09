# Kid Learning App

A React-based learning app for kids, featuring flashcard sets with dinosaurs, fruits, and animals.

## Design System

All design tokens and variables are documented in `design-system.json`. This includes:
- Colors (background, text, Dino theme colors)
- Typography (IBM Plex Sans font family)
- Spacing values
- Border radius values
- Dimensions
- Transform values

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Assets

### Image Assets
Card images (dinosaur, fruit, animals) are currently configured to use Figma's localhost URLs. To use local assets:

1. Download the images from Figma
2. Place them in `src/assets/` folder
3. Update the asset URLs in `src/config/assets.js`

### Icons
SVG icons (add, search) are included in `src/assets/` and can be customized as needed.

## Project Structure

```
kid-learning-app/
├── design-system.json    # Design tokens and variables
├── src/
│   ├── components/       # React components
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── CardList.jsx
│   │   └── CardSet.jsx
│   ├── assets/          # Images and icons
│   ├── config/          # Configuration files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
└── package.json
```

## Design Details

The app follows the Figma design specifications:
- Dark gray background (#21272a)
- Colorful card sets (Blue, Pink, Yellow)
- IBM Plex Sans typography
- Responsive layout with fixed width container (428px max)
- Rounded corners and modern UI elements
- Card images with rotation effects (28deg outer, 2deg inner)

## Future Enhancements

- Download actual card images from Figma and replace localhost URLs
- Add functionality to the Create button
- Implement search functionality
- Add card set detail pages
- Add animations and transitions
