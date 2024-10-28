# Audio Transcription Service

A modern web application for transcribing audio files using the Groq API. Supports multiple languages and provides a user-friendly interface for audio file uploads and transcription.

## Features

- Support for multiple audio formats (WAV, MP3, OGG, M4A)
- Multiple language support with automatic language detection
- Modern, responsive user interface with smooth animations
- Real-time transcription status updates and progress tracking
- Automatic handling of large audio files (>19.5MB)
- Easy-to-use file upload system with drag & drop support
- Download transcription results as text file
- Copy transcription to clipboard with one click
- Detailed status updates during processing
- Error handling with user-friendly messages

## Large File Handling

The application automatically handles large audio files:
- Files up to 19.5MB are processed directly
- Files larger than 19.5MB are automatically split into smaller chunks
- Each chunk is processed separately with progress tracking
- Results are seamlessly combined into a single transcription
- No strict file size limit (tested with files up to 80MB)

## User Interface Features

- Drag & drop file upload support
- File upload progress indication
- Real-time processing status updates
- Smooth animations for status changes
- Clear error messages and handling
- Responsive design for all screen sizes
- Easy-to-use language selection
- Download and copy options for transcription results

## Setup Instructions

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the project root and add your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open your web browser and navigate to `http://localhost:5000`

## Supported Languages

- English
- Chinese
- Spanish
- French
- German
- Japanese
- Korean
- Russian
- Italian
- Portuguese

## File Format Support

The application supports the following audio formats:
- WAV
- MP3
- OGG
- M4A

## Technical Details

### Frontend
- HTML5 with semantic markup
- CSS using Tailwind CSS framework
- Custom animations and transitions
- JavaScript for dynamic interactions
- Real-time status updates
- Error handling and user feedback
- Drag & drop file upload handling

### Backend
- Flask (Python) server
- Groq Transcription API integration
- pydub for audio processing
- Efficient chunk processing for large files
- Automatic file cleanup
- Comprehensive error handling

### Audio Processing
- Automatic format detection
- Smart chunking for large files
- Progress tracking for each chunk
- Efficient memory usage
- Temporary file management

## Error Handling

The application includes comprehensive error handling for:
- Invalid file formats
- Upload failures
- Processing errors
- API communication issues
- File size limitations
- Network connectivity problems

## Performance Optimization

- Efficient chunk size calculation
- Automatic cleanup of temporary files
- Optimized memory usage for large files
- Smooth animations and transitions
- Responsive UI updates

## Additional Requirements

For audio processing, you'll need to install FFmpeg:

### Windows
1. Download FFmpeg from https://www.ffmpeg.org/download.html
2. Add FFmpeg to your system PATH

### Mac
```bash
brew install ffmpeg
```

### Linux
```bash
sudo apt-get install ffmpeg
```

## Browser Support

The application is tested and supported on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations

- Secure file handling
- Temporary file cleanup
- Input validation
- Error logging
- API key protection
