# Kid Learning App - iOS Mobile Version

A React Native Expo app for iOS that helps kids learn about dinosaurs, fruits, and animals with interactive flip cards and text-to-speech functionality.

## Prerequisites

1. **Node.js** (v18 or later)
2. **Xcode** (for iOS Simulator)
   - Open Xcode at least once and accept the license agreement
   - Install iOS Simulator from Xcode > Preferences > Components
3. **Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

## Getting Started

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Start the Expo Development Server

```bash
npm start
```

Or start directly with iOS Simulator:

```bash
npm run ios
```

### 3. Open in iOS Simulator

Once the Metro bundler is running:

- Press `i` to open in iOS Simulator
- Or scan the QR code with the Expo Go app on your physical device

## Project Structure

```
mobile/
  App.js                 # Main app entry point with navigation
  app.json               # Expo configuration
  package.json           # Dependencies
  assets/                # Images and icons
    dino/                # Dinosaur images
    fruit/               # Fruit images
    animals/             # Animal images
  src/
    components/          # Reusable UI components
      CardSetCard.js     # Card set preview component
      FlipCard.js        # Interactive flip card component
    config/
      assets.js          # Asset configuration
      cardData.js        # Card data and content
    screens/
      HomeScreen.js      # Main library screen
      CardDetailScreen.js # Card set detail screen
    services/
      speechService.js   # Text-to-speech service
```

## Features

- Browse card sets (Dinosaurs, Fruits, Animals)
- Interactive flip cards with detailed information
- Text-to-speech pronunciation in English and Chinese
- Beautiful, kid-friendly UI design

## Troubleshooting

### Xcode Simulator Issues

If you see "Unable to run simctl" error:

1. Make sure Xcode is installed from the App Store
2. Open Xcode and accept the license agreement
3. Run: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
4. Install command line tools: `xcode-select --install`

### Metro Bundler Issues

If Metro bundler fails to start:

```bash
# Clear Metro cache
npx expo start --clear
```

### Dependency Issues

```bash
# Reset node_modules and reinstall
rm -rf node_modules
npm install
```

## Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Start and open in iOS Simulator
- `npm run android` - Start and open in Android Emulator
- `npm run web` - Start web version

