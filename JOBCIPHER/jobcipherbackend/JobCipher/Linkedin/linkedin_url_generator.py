import urllib.parse

# def generate_linkedin_job_url(keyword, location, experience=None, job_type=None, remote=None, date_posted=None):
#     base_url = "https://www.linkedin.com/jobs/search/"

#     params = {
#         "keywords": keyword,
#         "location": location,
#     }

#     # Add optional filters
#     if experience:
#         params["f_E"] = experience  # Example: "1,2" for Internship & Entry-level
#     if job_type:
#         params["f_JT"] = job_type  # Example: "F" for Full-time
#     if remote:
#         params["f_WT"] = remote  # Example: "3" for Remote
#     if date_posted:
#         params["f_TPR"] = date_posted  # Example: "r604800" for past 7 days

#     # Encode the parameters properly
#     query_string = urllib.parse.urlencode(params, safe=",")
#     return f"{base_url}?{query_string}"


def generate_linkedin_job_url(keyword,location,experience,job_type,remote,date_posted,company,industry):
    """Generates a LinkedIn job search URL based on user input."""
    base_url = "https://www.linkedin.com/jobs/search/?"
    
    
    
    job_type_map = {"Full-time": "F", "Part-time": "P", "Contract": "C", "Internship": "I"}
    remote_map = {"on-site": "1", "hybrid": "3", "remote": "2"}
    date_posted_map = {"24 hours": "r86400", "1 week": "r604800", "1 month": "r2592000"}
    industry_map = {"Software": "4", "Finance": "96", "Education": "142"}
    if experience:
        experience=int(experience)
        if experience==0:
            experience=1
        elif experience==1:
            experience=2
        elif experience<=5:
            experience=3
        elif experience<=10:
            experience=4
        elif experience<=15:
            experience=5
        else :
            experience=6
    # keyword = input("Enter job keyword: ").strip().replace(" ", "%20")
    # location = input("Enter job location: ").strip().replace(" ", "%20")
    # Default to "1" if not in map
    job_type = job_type_map.get(job_type)
    remote = remote_map.get(remote)
    date_posted = date_posted_map.get(date_posted)
    industry = industry_map.get(industry)
    
    query_params = [
        f"keywords={keyword}",
        f"location={location}",
        f"f_E={experience}" if experience else "",
        f"f_JT={job_type}" if job_type else "",
        f"f_WT={remote}" if remote else "",
        f"f_TPR={date_posted}" if date_posted else "",
        f"f_C={company}" if company else "",
        f"f_I={industry}" if industry else ""
    ]
    
    linkedin_url = base_url + "&".join(filter(None, query_params))
    return linkedin_url

