from groq import Groq

from text_extraction import extract_clean_text_from_pdf


pdf_file = "Your_PDF" 
extracted_text = extract_clean_text_from_pdf(pdf_file)

client = Groq(
    api_key= 'Your_API_key',
)


chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": extracted_text+" strictly extract skills and location and give a single list which are mentioned in resume ",
        }
    ],
    model="llama3-70b-8192",
    # model="mixtral-8x7b-32768",
)

print(chat_completion.choices[0].message.content)
