# Testing the TTS Feature

## Quick Start Guide

### Step 1: Install Backend Dependencies

Open a terminal and run:

```bash
cd server
pip3 install -r requirements.txt
```

If you encounter permission issues, you may need to use:
```bash
pip3 install --user -r requirements.txt
```

Or use a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Start the Backend Server

In the `server` directory, run:

```bash
python3 server.py
```

You should see output like:
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

The backend is now running on `http://localhost:8000`

### Step 3: Start the Frontend

Open a **new terminal window** and run:

```bash
npm run dev
```

The frontend should start on `http://localhost:5173` (or another port if 5173 is busy)

### Step 4: Test the TTS Feature

1. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)
2. Navigate to a card set (e.g., click on "Dinosaur")
3. Click on any card to flip it
4. Click the audio/sound button on the back of the card
5. You should hear:
   - The English name spoken with `en-US-AnaNeural` voice
   - The Chinese name spoken with `zh-CN-XiaoYiNeural` voice (lively, kid-friendly)
   - Pronunciation practice
   - Recognition features in Chinese
   - Fun fact in Chinese

## Testing Backend API Directly

You can test the backend API directly using curl:

```bash
# Test health check
curl http://localhost:8000/

# Test TTS with English
curl -X POST http://localhost:8000/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test", "lang": "en-US"}' \
  --output test-english.mp3

# Test TTS with Chinese
curl -X POST http://localhost:8000/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "你好，这是一个测试", "lang": "zh-CN"}' \
  --output test-chinese.mp3

# Play the audio files to verify quality
```

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use: `lsof -i :8000`
- Make sure all dependencies are installed: `pip3 list | grep edge-tts`
- Check Python version: `python3 --version` (should be 3.7+)

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:8000/`
- Check browser console for CORS errors
- Verify `VITE_TTS_BACKEND_URL` in `.env` matches backend URL

### Audio doesn't play
- Check browser console for errors
- Verify backend is responding: `curl http://localhost:8000/tts -X POST -H "Content-Type: application/json" -d '{"text":"test","lang":"en-US"}'`
- The app will automatically fall back to Web Speech API if backend is unavailable

### Chinese voice doesn't sound right
- Verify backend is using correct voice: Check server logs when making a request
- The voice should be `zh-CN-XiaoYiNeural` (lively, kid-friendly)
- You can test different voices by modifying `VOICE_CONFIG` in `server/server.py`

## Expected Behavior

- **With backend running**: High-quality neural voices, natural Chinese pronunciation
- **Without backend**: Falls back to Web Speech API (may have less natural Chinese voices)
- **Network errors**: Automatic retry (2 attempts), then fallback to Web Speech API

## Voice Quality Comparison

- **Backend (edge-tts)**: Natural, kid-friendly, high-quality neural voices
- **Fallback (Web Speech API)**: Browser-dependent, may vary in quality for Chinese

