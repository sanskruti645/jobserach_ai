
# from Indeed.Indeed_job_scraper import scrape_indeed_jobs
# from Indeed.Indeed_url_generator import generate_indeed_url_india


from Indeed_job_scraper import scrape_indeed_jobs
from Indeed_url_generator import generate_indeed_url_india

if __name__ == "__main__":
    job_role = input("Enter the job role (e.g., Python Developer): ")
    location = input("Enter the location (e.g., Bengaluru, Karnataka): ")
    
   
    valid_fromage_values = ["1", "3", "7", "14"]
    date_posted_filter = input(
        "Enter how recent jobs should be posted (1 for last day, 3 for last three days, "
        "7 for last seven days, 14 for last two weeks): ")
    
    if date_posted_filter not in valid_fromage_values:
        print(f"Invalid value entered for date posted. Defaulting to '14' (last two weeks).")
        date_posted_filter = "14"
    target_url = generate_indeed_url_india(job_role, location,  date_posted=date_posted_filter)
    
    print(f"Scraping job listings from: {target_url}")

    jobs = scrape_indeed_jobs(target_url)


    for job in jobs:
        if job["Job Title"]!="N/A":
            print(job)
            print("-"*50)

# def indeed(job_role,location,date_posted_filter):
    valid_fromage_values = ["1", "3", "7", "14"]
    
    if date_posted_filter not in valid_fromage_values:
        print(f"Invalid value entered for date posted. Defaulting to '14' (last two weeks).")
        date_posted_filter = "14"
    target_url = generate_indeed_url_india(job_role, location,  date_posted_filter)
        
    print(f"Scraping job listings from: {target_url}")

    jobs = scrape_indeed_jobs(target_url)


    for job in jobs:
        if job["Job Title"]!="N/A":
            print(job)
            print("-"*50)