import fitz
import re


def clean_text(text):
    # Remove bullet points, pipes, commas, and non-alphanumeric characters (except spaces and newlines)
    text = re.sub(r"[-•●▪◦–—·]", "", text)  
    text = re.sub(r"\|", "", text) 
    text = re.sub(r",", "", text)  
    text = re.sub(r"http\S+", "", text)  
    text = re.sub(r"[^a-zA-Z0-9\s\n]", "", text)
    text = re.sub(r"\s+", " ", text).strip()  
    return text

def extract_clean_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            page_text = page.get_text("text")
            cleaned_text = clean_text(page_text)
            text += cleaned_text + "\n"
    return text
