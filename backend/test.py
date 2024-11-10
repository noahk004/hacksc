import requests

elements = [
    {
        "content": "",
        "name": "username",
        "tag": "input",
        "type": "text"
    },
    {
        "content": "",
        "name": "password",
        "tag": "input",
        "type": "password"
    },
    {
        "content": "Log in",
        "name": "",
        "tag": "button",
        "type": "submit"
    },
    {
        "content": "Log in with Facebook",
        "name": "",
        "tag": "button",
        "type": "button"
    },
    {
        "content": "Forgot password?",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Don't have an account? Sign up",
        "tag": "p"
    },
    {
        "content": "Sign up",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Meta",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "About",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Blog",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Jobs",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Help",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "API",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Privacy",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Consumer Health Privacy",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Terms",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Locations",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Instagram Lite",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Threads",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Contact Uploading & Non-Users",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Meta Verified",
        "name": "",
        "tag": "a",
        "type": ""
    },
    {
        "content": "Afrikaans\nالعربية\nČeština\nDansk\nDeutsch\nΕλληνικά\nEnglish\nEnglish (UK)\nEspañol (España)\nEspañol\nفارسی\nSuomi\nFrançais\nעברית\nBahasa Indonesia\nItaliano\n日本語\n한국어\nBahasa Melayu\nNorsk\nNederlands\nPolski\nPortuguês (Brasil)\nPortuguês (Portugal)\nРусский\nSvenska\nภาษาไทย\nFilipino\nTürkçe\n中文(简体)\n中文(台灣)\nবাংলা\nગુજરાતી\nहिन्दी\nHrvatski\nMagyar\nಕನ್ನಡ\nമലയാളം\nमराठी\nनेपाली\nਪੰਜਾਬੀ\nසිංහල\nSlovenčina\nதமிழ்\nతెలుగు\nاردو\nTiếng Việt\n中文(香港)\nБългарски\nFrançais (Canada)\nRomână\nСрпски\nУкраїнська",
        "name": "",
        "tag": "select",
        "type": "select-one"
    }
]

important_elements = []
url = "https://af16-23-233-149-50.ngrok-free.app/generate"

def get_important_elements(elems):
    url = "https://af16-23-233-149-50.ngrok-free.app/generate"
    test_messages = {
        "messages": [
            {"role": "system", "content": str(elems) + "these are all the elements on the page"},
            {"role": "user", "content": """As a user, what are the 5 most important elements on this page? List them in order of importance, in this format:
             [element1, element2, element3, element4, element5], dont change any of the formatting , keep the content name tag type format"""}
        ]
    }
    response = requests.post(url, json=test_messages)
    important_elements = response.json()['response'][-1]['content']
    return important_elements

def read_important_elements(important_elements):
    url = "https://af16-23-233-149-50.ngrok-free.app/generate"
    test_messages = {
        "messages": [
            {"role": "system", "content": str(important_elements) + "these are the 5 most important elements on the page"},
            {"role": "user", "content": "Can you say a brief description of each of the important elements?"}
        ]
    }
    response = requests.post(url, json=test_messages)
    description_of_important_elements = response.json()['response'][-1]['content']
    return description_of_important_elements


def generate_action(user_input, url = "https://af16-23-233-149-50.ngrok-free.app/generate"):
    # Test payload
    messages = {
        "messages": [
            {
                "role": "system", 
                "content": str(elements) +  """these are all the elements on the page. Your job is to sort them by importance, and, based off of
                what the user says, take action on one of them. here is the format on how you return:
                if they want to input something, you return a dictionary with this format:{'action': 'input', 'input_name': 'username', 'text_value': 'justin.siek'}
                if they want to click something, you return a dictionary with this format:{'action': 'click', 'button_content': 'Log in'}"""
            },
            {"role": "user", "content": user_input}
        ]
    }

    # Make the request
    response = requests.post(url, json=messages)
    return response.json()['response'][-1]['content']

# Example usage
if __name__ == "__main__":
    important_elements = get_important_elements(elements)
    print("Important elements:", important_elements)
    description_of_important_elements = read_important_elements(important_elements)
    print("Description of important elements:", description_of_important_elements)
    result = generate_action("I have finished entering the information, log me in")
    print("Response:", result)
