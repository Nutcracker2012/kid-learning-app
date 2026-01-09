#!/usr/bin/env python3
"""
Simple test script to verify the TTS backend is working
Run this after starting the server to test the API
"""

import requests
import json

BACKEND_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"✓ Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_english_tts():
    """Test English TTS"""
    print("\nTesting English TTS...")
    try:
        response = requests.post(
            f"{BACKEND_URL}/tts",
            json={
                "text": "Hello, this is a test of the TTS service.",
                "lang": "en-US"
            },
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            print(f"✓ English TTS: Success ({len(response.content)} bytes)")
            with open("test_english.mp3", "wb") as f:
                f.write(response.content)
            print("  Audio saved to test_english.mp3")
            return True
        else:
            print(f"✗ English TTS failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ English TTS error: {e}")
        return False

def test_chinese_tts():
    """Test Chinese TTS"""
    print("\nTesting Chinese TTS...")
    try:
        response = requests.post(
            f"{BACKEND_URL}/tts",
            json={
                "text": "你好，这是一个测试。",
                "lang": "zh-CN"
            },
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            print(f"✓ Chinese TTS: Success ({len(response.content)} bytes)")
            voice_used = response.headers.get("X-Voice-Used", "unknown")
            print(f"  Voice used: {voice_used}")
            with open("test_chinese.mp3", "wb") as f:
                f.write(response.content)
            print("  Audio saved to test_chinese.mp3")
            return True
        else:
            print(f"✗ Chinese TTS failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Chinese TTS error: {e}")
        return False

def main():
    print("=" * 50)
    print("TTS Backend Test Script")
    print("=" * 50)
    print(f"\nMake sure the backend is running on {BACKEND_URL}\n")
    
    results = []
    results.append(("Health Check", test_health_check()))
    results.append(("English TTS", test_english_tts()))
    results.append(("Chinese TTS", test_chinese_tts()))
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print("=" * 50)
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {name}")
    
    all_passed = all(result for _, result in results)
    print("\n" + "=" * 50)
    if all_passed:
        print("✓ All tests passed! Backend is working correctly.")
    else:
        print("✗ Some tests failed. Check the errors above.")
    print("=" * 50)

if __name__ == "__main__":
    main()

