"""
TTS Backend Service using edge-tts
Provides kid-friendly neural voices for the learning app
"""

import os
import asyncio
import edge_tts
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Voice configuration for kid-friendly voices
VOICE_CONFIG = {
    'en-US': os.getenv('EN_DEFAULT_VOICE', 'en-US-AnaNeural'),  # Child-friendly English
    'zh-CN': os.getenv('ZH_DEFAULT_VOICE', 'zh-CN-XiaoYiNeural'),  # Lively, kid-friendly Chinese
    'zh-TW': 'zh-TW-HsiaoYuNeural',  # Friendly Taiwanese Mandarin
    'default': 'en-US-AnaNeural'
}

# Initialize FastAPI app
app = FastAPI(title="TTS Service", version="1.0.0")

# CORS configuration
cors_origin = os.getenv('CORS_ORIGIN', 'http://localhost:5173')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[cors_origin, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TTSRequest(BaseModel):
    text: str
    lang: str = "en-US"
    voice: str = None
    rate: str = "+0%"
    pitch: str = "+0Hz"
    volume: str = "+0%"


def get_voice_for_lang(lang: str, requested_voice: str = None) -> str:
    """
    Get the appropriate voice for a given language code.
    Prioritizes requested voice, then language-specific default, then global default.
    """
    if requested_voice:
        return requested_voice
    
    # Normalize language code for comparison
    lang_lower = lang.lower().strip()
    
    # Create a case-insensitive lookup
    voice_config_lower = {k.lower(): v for k, v in VOICE_CONFIG.items()}
    
    # Check for exact match (case-insensitive)
    if lang_lower in voice_config_lower:
        selected_voice = voice_config_lower[lang_lower]
        print(f"[Voice Selection] Exact match for '{lang}' -> '{selected_voice}'")
        return selected_voice
    
    # Check for language prefix match (e.g., 'en' matches 'en-US')
    lang_prefix = lang_lower.split('-')[0]
    for key, value in voice_config_lower.items():
        if key.startswith(lang_prefix) and key != 'default':
            print(f"[Voice Selection] Prefix match for '{lang}' (prefix: '{lang_prefix}') -> '{value}'")
            return value
    
    # Fallback to default
    default_voice = VOICE_CONFIG['default']
    print(f"[Voice Selection] Using default voice for '{lang}' -> '{default_voice}'")
    return default_voice


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "service": "TTS Service"}


@app.get("/voices")
async def list_voices():
    """List all available voices"""
    try:
        voices = await edge_tts.list_voices()
        return {"voices": voices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing voices: {str(e)}")


@app.get("/voices/check")
async def check_configured_voices():
    """Check if configured voices are available"""
    try:
        all_voices = await edge_tts.list_voices()
        voice_dict = {v["ShortName"]: v for v in all_voices}
        
        results = {}
        for lang, voice_name in VOICE_CONFIG.items():
            if voice_name in voice_dict:
                results[lang] = {
                    "configured": voice_name,
                    "available": True,
                    "details": voice_dict[voice_name]
                }
            else:
                results[lang] = {
                    "configured": voice_name,
                    "available": False,
                    "error": f"Voice '{voice_name}' not found"
                }
        
        return {
            "status": "ok",
            "configured_voices": results,
            "total_voices_available": len(all_voices)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking voices: {str(e)}")


@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech using edge-tts.
    Returns audio as MP3 binary data.
    """
    try:
        # Get voice for the language
        voice = get_voice_for_lang(request.lang, request.voice)
        
        # Log voice selection for debugging
        print(f"[TTS] Language: {request.lang}, Selected Voice: {voice}, Text: {request.text[:50]}...")
        
        # edge-tts Communicate accepts rate, pitch, and volume as direct parameters
        # Format: Communicate(text, voice, rate="+0%", pitch="+0Hz", volume="+0%")
        communicate = edge_tts.Communicate(
            request.text,
            voice,
            rate=request.rate,
            pitch=request.pitch,
            volume=request.volume
        )
        
        # Collect audio data
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
        
        if not audio_data:
            raise HTTPException(status_code=500, detail="No audio data generated")
        
        # Return audio as MP3
        return Response(
            content=audio_data,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=tts.mp3",
                "X-Voice-Used": voice
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")


@app.post("/tts/batch")
async def text_to_speech_batch(requests: list[TTSRequest]):
    """
    Convert multiple texts to speech in sequence.
    Returns a list of base64-encoded audio data.
    """
    try:
        results = []
        for request in requests:
            voice = get_voice_for_lang(request.lang, request.voice)
            
            # edge-tts Communicate accepts rate, pitch, and volume as direct parameters
            communicate = edge_tts.Communicate(
                request.text,
                voice,
                rate=request.rate,
                pitch=request.pitch,
                volume=request.volume
            )
            
            audio_data = b""
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]
            
            if audio_data:
                import base64
                results.append({
                    "audio": base64.b64encode(audio_data).decode('utf-8'),
                    "voice": voice,
                    "format": "mp3"
                })
            else:
                results.append({
                    "error": "No audio data generated",
                    "text": request.text
                })
        
        return {"results": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating batch speech: {str(e)}")


if __name__ == "__main__":
    port = int(os.getenv('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

