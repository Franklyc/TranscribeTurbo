import os
from flask import Flask, request, jsonify, render_template
from groq import Groq
from dotenv import load_dotenv
from pydub import AudioSegment
import math
import tempfile
import json

load_dotenv()

app = Flask(__name__)
client = Groq()

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'm4a'}
CHUNK_SIZE_MB = 19.5  # Slightly reduced to prevent edge cases
UPLOAD_FOLDER = 'uploads'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

LANGUAGES = {
    'en': 'English',
    'zh': 'Chinese',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ru': 'Russian',
    'it': 'Italian',
    'pt': 'Portuguese'
}

@app.route('/')
def index():
    return render_template('index.html', languages=LANGUAGES)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    language = request.form.get('language', 'en')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not supported'}), 400
    
    try:
        print(f"Processing file: {file.filename}")
        # Create uploads directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Save the uploaded file temporarily
        temp_input = os.path.join(UPLOAD_FOLDER, 'input_' + file.filename)
        file.save(temp_input)
        
        # Get file size
        file_size_mb = os.path.getsize(temp_input) / (1024 * 1024)
        print(f"File size: {file_size_mb:.2f}MB")
        
        if file_size_mb <= CHUNK_SIZE_MB:
            print("Processing single file")
            # Process single file
            with open(temp_input, 'rb') as audio_file:
                transcription = client.audio.transcriptions.create(
                    file=(temp_input, audio_file.read()),
                    model="whisper-large-v3-turbo",
                    language=language,
                    response_format="verbose_json"
                )
            
            # Clean up
            os.remove(temp_input)
            
            result = {
                'success': True,
                'text': transcription.text,
                'status': 'Transcription completed successfully'
            }
            print("Transcription result:", result)
            return jsonify(result)
        else:
            print("Processing large file in chunks")
            # Load audio file
            audio = AudioSegment.from_file(temp_input)
            duration_ms = len(audio)
            
            # Calculate number of chunks based on duration instead of file size
            # Ensure each chunk is at least 1 second long
            chunk_duration_ms = max(duration_ms // math.ceil(file_size_mb / CHUNK_SIZE_MB), 1000)
            num_chunks = math.ceil(duration_ms / chunk_duration_ms)
            
            print(f"Splitting into {num_chunks} chunks")
            combined_text = []
            
            for i in range(num_chunks):
                print(f"Processing chunk {i+1}/{num_chunks}")
                start_ms = i * chunk_duration_ms
                end_ms = min((i + 1) * chunk_duration_ms, duration_ms)
                
                # Ensure chunk is at least 0.1 seconds long
                if end_ms - start_ms < 100:
                    continue
                
                # Extract chunk
                chunk = audio[start_ms:end_ms]
                chunk_path = os.path.join(UPLOAD_FOLDER, f'chunk_{i}.wav')
                chunk.export(chunk_path, format='wav')
                
                # Transcribe chunk
                with open(chunk_path, 'rb') as chunk_file:
                    chunk_transcription = client.audio.transcriptions.create(
                        file=(chunk_path, chunk_file.read()),
                        model="whisper-large-v3-turbo",
                        language=language,
                        response_format="verbose_json"
                    )
                
                combined_text.append(chunk_transcription.text)
                os.remove(chunk_path)
                print(f"Chunk {i+1} processed")
            
            # Clean up original file
            os.remove(temp_input)
            
            result = {
                'success': True,
                'text': ' '.join(combined_text),
                'status': f'Successfully processed {num_chunks} chunks'
            }
            print("Final result:", result)
            return jsonify(result)
            
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        # Cleanup any remaining files
        if 'temp_input' in locals() and os.path.exists(temp_input):
            os.remove(temp_input)
        return jsonify({
            'error': str(e),
            'status': 'Error occurred during transcription'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
