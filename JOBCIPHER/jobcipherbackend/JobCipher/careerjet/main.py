from bs4 import BeautifulSoup

# Load the HTML file
html_file = "Java Jobs in India _ Careerjet.html"
with open(html_file, "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

# Extract job listings using correct class names
job_listings = []
for job in soup.find_all("article", class_="job clicky"):
    title_tag = job.find("h2").find("a")
    company_tag = job.find("p", class_="company")
    location_tag = job.find("ul", class_="location").find("li")
    summary_tag = job.find("div", class_="desc")
    
    title = title_tag.get_text(strip=True) if title_tag else "N/A"
    company = company_tag.get_text(strip=True) if company_tag else "N/A"
    location = location_tag.get_text(strip=True) if location_tag else "N/A"
    summary = summary_tag.get_text(strip=True) if summary_tag else "N/A"
    
    job_listings.append({
        "Title": title,
        "Company": company,
        "Location": location,
        "Summary": summary
    })

# Print extracted jobs
for job in job_listings:
    print(job)
