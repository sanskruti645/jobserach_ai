from bs4 import BeautifulSoup
import csv
from io import StringIO

def extract_rating(rating_a):
    if rating_a is None or rating_a.find('span', class_="main-2") is None:
        return "None"
    else:
        return rating_a.find('span', class_="main-2").text

def parse_job_data_from_soup(page_jobs):
    job_listings = []
    for job in page_jobs:
        job = BeautifulSoup(str(job), 'html.parser')
        row1 = job.find('div', class_="row1")
        row2 = job.find('div', class_="row2")
        row3 = job.find('div', class_="row3")
        row4 = job.find('div', class_="row4")
        row5 = job.find('div', class_="row5")
        row6 = job.find('div', class_="row6")
        
        job_title_tag = row1.find('a')
        job_title = job_title_tag.text.strip() if job_title_tag else "No Title"
        job_link = job_title_tag['href'] if job_title_tag else "No Link"
        # print(job_link)
        company_name = row2.span.a.text
        rating_a = row2.span
        rating = extract_rating(rating_a)
        
        job_details = row3.find('div', class_="job-details")
        ex_wrap = job_details.find('span', class_="exp-wrap").span.span.text
        location = job_details.find('span', class_="loc-wrap ver-line").span.span.text

        all_tech_stack = []
        ul_tag = row5.find("ul", class_="dot-gt tag-li")  # Ensure correct class name
        if ul_tag:
            for tech_stack in row5.ul.find_all('li', class_="dot-gt tag-li"):
                tech_stack = tech_stack.text
                all_tech_stack.append(tech_stack)

        job_listings.append({
            "Job Title": job_title,
            "Company Name": company_name,
            "Rating": rating,
            "Experience": ex_wrap,
            "Location": location,
            "Tech Stack": ", ".join(all_tech_stack),
            "Job link":job_link
        })
    print(job_listings)
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=["Job Title", "Company Name", "Rating", "Experience", "Location", "Tech Stack","Job link"])
    writer.writeheader()
    writer.writerows(job_listings)
    
    return output.getvalue()
