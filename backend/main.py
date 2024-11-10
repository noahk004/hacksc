from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from conversation.speech_to_text import process_audio_data
from conversation.text_to_speech import textToSpeech

app = Flask(__name__)
CORS(app)  



elements = []
url = "https://7430-38-175-183-61.ngrok-free.app/generate"

def generate_action_dict(elements, command):
    messages = {
        "messages": [
            {
                "role": "system", 
                "content": str(elements) +  """Only return the dictionary, or else the extension will break. These are all the elements on the page. Your job is to sort them by importance, and, based off of
                what the user says, take action on one of them. here is the format on how you return:
                if they want to input something, you return a dictionary with this format:{'action': 'input', 'input_name': 'username', 'text_value': 'justin.siek'}
                if they want to click something, you return a dictionary with this format:{'action': 'click', 'button_content': 'Log in'}
                Extremely important that you do not return anything else besides the dictionary, or else the extension will break. If the prompt says password, it is a password field."""
            },
            {"role": "user", "content": command['user_command']}
        ]
    }
    response = requests.post(url, json=messages)
    action = response.json()['response'][-1]['content']
    return action

def generate_job_summary(elements, action):
    messages = {
        "messages": [
            {"role": "system", "content": str(elements) + """These are all of the elements in the page, and 
             this is the action that was taken:""" + str(action) + """
             Your job is to generate a very brief summary of the job that was done, and future possible actions that can be taken.
             This should be 30 words maximum."""}
        ]
    }
    response = requests.post(url, json=messages)
    summary = response.json()['response'][-1]['content']
    return summary




@app.route('/elements', methods=['POST'])
def sort_elements():
    data = request.get_json()
    global elements
    elements = data.get("elements", [])
    print("Elements Length: ", len(elements))
    return jsonify({"status": "success"})

@app.route('/execute', methods=['POST'])
def execute_command():
    command = request.get_json()
    job_summary = "Job Is Finished"
    action = generate_action_dict(elements, command)
    job_summary = generate_job_summary(elements, action)
    print("Action: ", action)
    
    # Convert the string response to a dictionary if needed
    if isinstance(action, str):
        import ast
        action_dict = ast.literal_eval(action)
    else:
        action_dict = action
        
    encoded_summary = textToSpeech(job_summary)
    print("Length of encoded summary: ", len(encoded_summary))
    return jsonify({"action": action_dict, "summary": encoded_summary})


@app.route('/userInput', methods=['POST'])
def translate_user_input():
    data = request.get_json()
    print("User Input: ", data)
    text = process_audio_data(data['user_command'])
    print("Translated Text: ", text)
    return jsonify({"text": text})

