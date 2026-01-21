from flask import Flask, request, jsonify
from groq import Groq
from text_extraction import extract_clean_text_from_pdf
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
# Set your API key
API_KEY = "API_KEY"

@app.route('/extract', methods=['POST'])
def extract_from_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save the file temporarily
    file_path = f"/tmp/{file.filename}"
    file.save(file_path)    

    # Extract text
    extracted_text = extract_clean_text_from_pdf(file_path)

    # Initialize Groq Client
    client = Groq(api_key=API_KEY)

    # Send request to Groq
    chat_completion = client.chat.completions.create(
    messages=[
        {
                "role": "user",
                "content": extracted_text + " strictly extract applicant name, branch, college, most relevant skill and location and give a single list which are mentioned in resume if branch is not mentioned set default to CSE"}
        ],
        model="llama3-70b-8192",
    )

    # Extract output
    output = chat_completion.choices[0].message.content

    # Remove the temporary file
    os.remove(file_path)
    print(output)
    return jsonify({"status":"success","extracted_info": output})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
