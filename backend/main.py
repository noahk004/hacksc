from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/", methods=['POST'])
def test():
    try:
        # Get the JSON data from the request body
        data = request.json
        return jsonify(message="Hello, World!", received_data=data)
    except Exception as e:
        return jsonify(error=str(e)), 400
    

if __name__ == "__main__":
    app.run(debug=True)
