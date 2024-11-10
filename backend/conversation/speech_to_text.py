import speech_recognition as sr
import base64
import io
from pydub import AudioSegment
import tempfile
import os
import subprocess

def process_audio_data(blob: str) -> str:
    # Decode base64 string to bytes
    audio_bytes = base64.b64decode(blob)
    
    # Create a temporary file for the WebM data
    with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as webm_file:
        webm_file.write(audio_bytes)
        webm_path = webm_file.name
    
    try:
        # Create a temporary file for the WAV output
        wav_path = webm_path + '.wav'
        
        # Convert WebM to WAV using ffmpeg
        subprocess.run([
            'ffmpeg',
            '-i', webm_path,           # Input file
            '-acodec', 'pcm_s16le',    # Audio codec
            '-ac', '1',                # Mono audio
            '-ar', '16000',            # Sample rate
            wav_path                   # Output file
        ], capture_output=True)
        
        # Use speech recognition on the WAV file
        r = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = r.record(source)
            try:
                text = r.recognize_google(audio_data)
                print("Detected text:", text)
                return text
            except sr.UnknownValueError:
                print("Google Speech Recognition could not understand audio")
                return ""
            except sr.RequestError as e:
                print("Could not request results from Google Speech Recognition service; {0}".format(e))
                return ""
    finally:
        # Clean up temporary files
        os.unlink(webm_path)
        if os.path.exists(wav_path):
            os.unlink(wav_path)
    
if __name__=="__main__":
    text = process_audio_data()
    