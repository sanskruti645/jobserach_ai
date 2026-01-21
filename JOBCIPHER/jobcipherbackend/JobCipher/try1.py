
import threading
from Linkedin.linkedin import linkedin
from Naukri.naukri_selenium import naukri
from careerjet.real_time_main import careerjet
# User Input


# keyword = input("Enter job keyword: ").strip()
# location = input("Enter job location: ").strip()
# experience = input("Enter experience level (In years, put 1 for entry level): ").strip()
# job_type = input("Enter job type (Full-time, Part-time, Contract, Internship): ").strip().lower()
# remote = input("Enter remote work type (On-site, Hybrid, Remote): ").strip().lower()
# date_posted = input("Enter date posted filter (24 hours, 1 week, 1 month): ").strip().lower()
# company = input("Enter company ID (optional, leave blank if not needed): ").strip()
# industry = input("Enter industry filter (Software, Finance, Education): ").strip()
# ctc_filters = input("Enter salary ranges (in LPA, separated by commas, leave blank if not needed): ").strip().lower().split(",")
# radius = input("Enter radius in km: ").strip()

keyword="java"
location="india"
experience=1
job_type="fulltime"
remote="on-site"
date_posted="1 week"
company=""
industry=""
ctc_filters=""
radius="10"

# Creating Threads
# linkedin_thread = threading.Thread(target=linkedin, args=(keyword, location, experience, job_type, remote, date_posted, company, industry))
# naukri_thread = threading.Thread(target=naukri, args=(keyword, location, experience, remote, ctc_filters, date_posted))
# careerjet_thread = threading.Thread(target=careerjet, args=(keyword, location, job_type, job_type, company, date_posted, radius))
linkedin_result=linkedin(keyword, location, experience, job_type, remote, date_posted, company, industry)
# Starting Threads
# linkedin_thread.start()
# naukri_thread.start()
# careerjet_thread.start()
# Wait for both threads to finish
# linkedin_thread.join()
# naukri_thread.join()
# careerjet_thread.join()
print(linkedin_result)
print("Both job searches completed!")
