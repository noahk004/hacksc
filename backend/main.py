from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/")
def test():
    return jsonify(message="Hello, World!")

@app.route('/elements', methods=['POST'])
def receive_elements():
    data = request.get_json()
    elements = data.get("elements", [])
    print("Received elements:", elements)
    return jsonify({"status": "success", "received_elements_count": len(elements)})