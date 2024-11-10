import requests 
import json
import base64

def textToSpeech(input: str) -> bytes:
    url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize"


    data = {
        "input": {"text": input},
        "voice": {"name": "en-US-Polyglot-1", "languageCode": "en-US"},
        "audioConfig": {"audioEncoding": "MP3"}
    };

    headers = {"content-type": "application/json", "X-Goog-Api-Key": "AIzaSyCzbNjgaZHOROAsurIAFo3_RhxsG6n0cU0" }

    r = requests.post(url=url, json=data, headers=headers)
    content = json.loads(r.content)
    print(content)

    base64_audio_string = content["audioContent"]

    # Decode the Base64 string into bytes
    audio_data = base64.b64decode(base64_audio_string)

    print(audio_data)
    return audio_data

    # Save the decoded audio to an audio file
    # with open("output.mp3", "wb") as audio_file:
    #     audio_file.write(audio_data)


if __name__ == "__main__":
    textToSpeech("Hello, how are you?")
