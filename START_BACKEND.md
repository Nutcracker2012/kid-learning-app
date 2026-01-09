# Starting the Backend Server

## Quick Start

### Option 1: Using the startup script
```bash
cd server
./start_server.sh
```

### Option 2: Manual start

1. **Install dependencies** (if not already installed):
   ```bash
   cd server
   pip3 install -r requirements.txt
   ```
   
   If you get permission errors, try:
   ```bash
   pip3 install --user -r requirements.txt
   ```
   
   Or use a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Start the server**:
   ```bash
   python3 server.py
   ```

   You should see:
   ```
   INFO:     Started server process [xxxxx]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

## Verify Server is Running

Open a new terminal and test:
```bash
curl http://localhost:8000/
```

You should see:
```json
{"status":"ok","service":"TTS Service"}
```

## Check Voice Configuration

Test if voices are configured correctly:
```bash
curl http://localhost:8000/voices/check
```

This will show which voices are available and configured.

## Troubleshooting

### Port 8000 already in use
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9
```

### Dependencies not installing
- Try using a virtual environment (recommended)
- Check Python version: `python3 --version` (should be 3.7+)
- Try: `pip3 install --upgrade pip` first

### Server won't start
- Check if all dependencies are installed: `pip3 list | grep edge-tts`
- Check for errors in the terminal output
- Verify Python version compatibility

## Next Steps

Once the server is running:
1. Keep this terminal open (server runs in foreground)
2. Open a new terminal for the frontend: `npm run dev`
3. Test the TTS feature in the app

