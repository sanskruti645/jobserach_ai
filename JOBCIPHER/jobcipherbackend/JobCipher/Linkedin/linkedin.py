from Linkedin.linkedin_url_generator import generate_linkedin_job_url
from Linkedin.linkedin_job_fetcher import fetchAndSave
from Linkedin.linkedin_job_parser import parse_all_job_details

def linkedin(keyword,location,experience,job_type,remote,date_posted,company,industry):
    # print(" linkedin thread started")
    url = generate_linkedin_job_url(keyword,location,experience,job_type,remote,date_posted,company,industry)
    # print("Generated LinkedIn URL:", url)
    # file_path = "data/text_3.html"
    data=fetchAndSave(url)


    return parse_all_job_details(data)
