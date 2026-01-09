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

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure TTS backend URL in `.env`:
```
VITE_TTS_BACKEND_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

### TTS Backend Setup

The app uses a Python backend service with edge-tts for high-quality, kid-friendly neural voices.

1. Install Python dependencies:
```bash
cd server
pip install -r requirements.txt
```

2. (Optional) Create a `.env` file in the `server/` directory:
```
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

3. Start the TTS backend server:
```bash
python server.py
```

Or with uvicorn:
```bash
uvicorn server:app --reload --port 8000
```

**Note:** The frontend will automatically fall back to Web Speech API if the backend is unavailable.

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
├── server/               # TTS backend service
│   ├── server.py        # FastAPI TTS server
│   ├── requirements.txt # Python dependencies
│   └── README.md        # Backend documentation
├── src/
│   ├── components/       # React components
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── CardList.jsx
│   │   ├── CardSet.jsx
│   │   └── FlipCard.jsx
│   ├── services/        # Services
│   │   └── ttsService.js # TTS service (uses backend API)
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

## TTS Features

The app uses Microsoft Edge TTS with kid-friendly neural voices:
- **English**: `en-US-AnaNeural` (child-friendly)
- **Chinese (Simplified)**: `zh-CN-XiaoYiNeural` (lively, cartoon-like)
- **Chinese (Traditional)**: `zh-TW-HsiaoYuNeural` (friendly)

The TTS service includes:
- Automatic fallback to Web Speech API if backend is unavailable
- Retry logic for failed requests
- Audio caching for better performance
- Support for speech rate, pitch, and volume adjustments

## Future Enhancements

- Download actual card images from Figma and replace localhost URLs
- Add functionality to the Create button
- Implement search functionality
- Add card set detail pages
- Add animations and transitions
- Audio pre-generation and caching for common phrases
