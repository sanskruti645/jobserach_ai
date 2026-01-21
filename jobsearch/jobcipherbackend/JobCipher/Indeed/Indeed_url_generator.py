import urllib.parse

def generate_indeed_url_india(job_role, location, date_posted=None):
    # time_map = {"month": 30, "week": 7, "hours": 1}
    
    # if date_posted:
    #     parts = date_posted.lower().split()
    #     if len(parts) == 2 and parts[1] in time_map:
    #         try:
    #             num = int(parts[0])
    #             date_posted=num * time_map[parts[1]]  # Convert to days
    #         except ValueError:
    #             date_posted=1 
    
    base_url = "https://in.indeed.com/jobs?"
    query_params = {
        "q": job_role,  # Job role
        "l": location,  # Location
        "fromage": date_posted if date_posted else "14",  # Date posted filter (e.g., "1" for last day)
    }
    # Encode the query parameters
    encoded_params = urllib.parse.urlencode(query_params)
    return base_url + encoded_params
