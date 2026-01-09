# TTS Backend Service

Backend service for text-to-speech using edge-tts with kid-friendly neural voices.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. (Optional) Create a `.env` file:
```
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

3. Run the server:
```bash
python server.py
```

Or with uvicorn:
```bash
uvicorn server:app --reload --port 8000
```

## API Endpoints

- `GET /` - Health check
- `GET /voices` - List all available voices
- `POST /tts` - Convert text to speech (returns MP3 audio)
- `POST /tts/batch` - Convert multiple texts to speech

## Voice Configuration

Default kid-friendly voices:
- English: `en-US-AnaNeural`
- Chinese (Simplified): `zh-CN-XiaoYiNeural`
- Chinese (Traditional): `zh-TW-HsiaoYuNeural`

