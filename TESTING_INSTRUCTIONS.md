# Testing Instructions for FlipCard Click Fix

## Quick Test (Web Version)

### Step 1: Start the Development Server

Open a terminal in the project root and run:

```bash
npm run dev
```

This will start the Vite development server. You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network:  use --host to expose
```

### Step 2: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

### Step 3: Test the Fix

1. **Navigate to a card detail page** (click on any card set, then click on a card)
2. **Test the volume icon click:**
   - Click on the volume/speaker icon (top right on the back of the card)
   - Expected: The text-to-speech should play (you'll hear the audio)
   - Expected: The card should NOT flip
3. **Test clicking elsewhere:**
   - Click anywhere else on the card (not on the volume icon)
   - Expected: The card should flip to show the front side
4. **Test the note volume icon:**
   - If the card has a note section, click the small volume icon next to "Note:"
   - Expected: The note audio should play
   - Expected: The card should NOT flip

## Full Test with TTS Backend (Recommended)

For the text-to-speech to work properly, you need the backend server running:

### Step 1: Start the Backend Server

Open a **new terminal** and run:

```bash
cd server
./start_server.sh
```

Or manually:
```bash
cd server
python3 server.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open** - the server needs to keep running.

### Step 2: Start the Frontend

In a **different terminal**, from the project root:

```bash
npm run dev
```

### Step 3: Test

Follow the same testing steps as above. With the backend running, you'll hear the full TTS audio sequence.

## Testing Mobile Version

### Step 1: Navigate to Mobile Directory

```bash
cd mobile
```

### Step 2: Start Expo

```bash
npm start
```

Or for specific platforms:
```bash
npm run ios      # For iOS simulator
npm run android  # For Android emulator
npm run web      # For web version
```

### Step 3: Test on Device/Simulator

1. Open the app on your device/simulator
2. Navigate to a card detail screen
3. Test the same interactions:
   - Tap the audio button → should play TTS, not flip
   - Tap elsewhere on card → should flip

## What to Look For

### ✅ Working Correctly:
- Clicking volume icon plays audio and does NOT flip the card
- Clicking anywhere else on the card flips it
- No console errors in browser dev tools

### ❌ If Not Working:
- Check browser console (F12) for errors
- Verify the backend is running if TTS doesn't work
- Make sure you're on the card detail page (not the home page)
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Troubleshooting

### TTS Not Working?
- Check if backend server is running: `curl http://localhost:8000/`
- Check browser console for errors
- The app will fall back to Web Speech API if backend is unavailable

### Card Still Flips When Clicking Volume Icon?
- Open browser DevTools (F12)
- Check Console tab for any JavaScript errors
- Check if the button elements have the correct classes
- Try a hard refresh to clear cache

### Mobile Not Working?
- Make sure you're in the `mobile/` directory
- Check that Expo is properly installed: `npx expo --version`
- For iOS: Make sure Xcode is installed
- For Android: Make sure Android Studio is set up

