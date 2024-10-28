# Audio Transcription Service

A modern web application for transcribing audio files using the Groq API, featuring a user-friendly interface with multi-language support.

## Core Features

- **Audio Support**
  - Multiple formats: WAV, MP3, OGG, M4A
  - Automatic handling of large files (>19.5MB) with smart chunking
  - Audio preview before transcription
  - No strict file size limit (tested up to 80MB)

- **User Interface**
  - Drag & drop file upload with progress tracking
  - Dark/Light mode with system preference detection
  - Timeline view with timestamp navigation
  - Responsive design for all devices
  - Custom animations and transitions
  - One-click copy and download options

- **Processing**
  - Real-time status updates
  - Detailed progress tracking
  - Automatic language detection
  - Smart chunk processing for large files
  - Comprehensive error handling

## Supported Languages

English, Chinese, Spanish, French, German, Japanese, Korean, Russian, Italian, Portuguese

## Setup Instructions

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Add Groq API key to `.env`:
   ```
   GROQ_API_KEY=your_api_key_here
   ```

3. Run application:
   ```bash
   python app.py
   ```

4. Visit `http://localhost:5000`

## Technical Overview

### Frontend
- HTML5 with semantic markup
- Tailwind CSS with custom animations
- Dynamic JavaScript interactions
- Theme system with persistence
- Timeline navigation
- Audio preview system
- Progress tracking UI

### Backend
- Flask server
- Groq API integration
- Audio processing with pydub
- Efficient chunk handling
- Automatic file cleanup

### Additional Requirements

FFmpeg installation required:

- Windows: Download from ffmpeg.org and add to PATH
- Mac: `brew install ffmpeg`
- Linux: `sudo apt-get install ffmpeg`

### Security & Performance

- Secure file handling and cleanup
- Input validation
- API key protection
- Optimized memory usage
- Efficient chunk processing
- Theme preference persistence
- Responsive UI optimizations

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)
