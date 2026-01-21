from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

genai.configure(api_key='YOUR_API_KEY')

def get_gemini_response(company_name):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            f"Give me info about {company_name} from ambitionbox website and ratings and average salaries as per age group an average of one paragraph and also provide link of ambition box where I can see more reviews about company and strictly only give review part dont include according to ambitionbox and give only one link at last do same for glassdoor"
        )
        
        return response.text.strip() if response.text else "No content generated"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/get_reviews', methods=['POST'])
def get_reviews():
    data = request.json
    company_name = data.get("company_name")
    
    if not company_name:
        return jsonify({"error": "Company name is required"}), 400
    
    response = get_gemini_response(company_name)
    return jsonify({"review": response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
