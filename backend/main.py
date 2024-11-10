from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  

@app.route("/")
def test():
    return jsonify(message="Hello, World!")

elements = []
url = "https://382a-201-92-225-229.ngrok-free.app/generate"

@app.route('/elements', methods=['POST'])
def sort_elements():
    data = request.get_json()
    elements = data.get("elements", [])
    print("generating...")
    test_messages = {
        "messages": [
            {"role": "system", "content": str(elements) + "these are all the elements on the page"},
            {"role": "user", "content": """As a user, what are the 5 most important elements on this page? List them in order of importance, in this format:
             [element1, element2, element3, element4, element5], dont change any of the formatting , keep the content name tag type format"""}
        ]
    }
    response = requests.post(url, json=test_messages)
    print(response.json())
    print('finished')
    elements = response.json()['response'][-1]['content']
    return jsonify({"status": "success"})

@app.route('/execute', methods=['POST'])
def execute_command():
    command = request.get_json()
    messages = {
        "messages": [
            {
                "role": "system", 
                "content": str(elements) +  """these are all the elements on the page. Your job is to sort them by importance, and, based off of
                what the user says, take action on one of them. here is the format on how you return:
                if they want to input something, you return a dictionary with this format:{'action': 'input', 'input_name': 'username', 'text_value': 'justin.siek'}
                if they want to click something, you return a dictionary with this format:{'action': 'click', 'button_content': 'Log in'}"""
            },
            {"role": "user", "content": command}
        ]
    }
    response = requests.post(url, json=messages)
    return jsonify({"response": response.json()['response'][-1]['content']})
