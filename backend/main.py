from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  

@app.route("/")
def test():
    return jsonify(message="Hello, World!")

elements = []
url = "https://e13b-174-116-39-92.ngrok-free.app/generate"

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
    print("Action: ", action)
    
    # Convert the string response to a dictionary if needed
    if isinstance(action, str):
        import ast
        action_dict = ast.literal_eval(action)
    else:
        action_dict = action
        
    return jsonify(action_dict)
