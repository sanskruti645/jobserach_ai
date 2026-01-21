import time
import google.generativeai as genai
genai.configure(api_key='YOUR_API_KEY')


def get_gemini_response(message):
    try:
        # Send the copied message to Gemini (replace URL with actual Gemini API endpoint)
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(f"Give me info about {message} from ambitionbox website and ratings also in one paragraph and also provide link of ambition box where I can see more reviews about company and strictly only give review part dont include according to ambitionbox and give only one link at last do same for glassdoor "  )
        
        # Check if the response contains content
        if response.text:
            return response.text.strip()  # Return the generated content
        else:
            return "No content generated"

    except Exception as e:
        print(str(e))
        return f"Error: {str(e)}"
    
    
if __name__=="__main__":
    comapany_name=input("Enter company name: ")
    response=get_gemini_response(comapany_name)
    print(response)
