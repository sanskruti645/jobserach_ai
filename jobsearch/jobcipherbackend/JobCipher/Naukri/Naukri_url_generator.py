from datetime import datetime, timedelta


def generate_naukri_job_url(keyword,location,experience,remote,ctc_filters,date_posted):
    """Generates a Naukri.com job search URL based on user input."""
    base_url = "https://www.naukri.com/"
    if experience:
        # print("true")
        experience=int(experience)
    else:
        experience=0
    # keyword = input("Enter job keyword: ").strip().replace(" ", "-")
    # location = input("Enter job location: ").strip().replace(" ", "-")
    
    # experience_map = {f"{i} years": str(i) for i in range(1, 31)}
    wfhtype_map = {"on-site": "0", "hybrid": "3", "remote": "2"}
    ctcfilter_map = {"3": "0to3", "6": "3to6", "10": "6to10", "15": "10to15", "25": "15to25", "50": "25to50"}
    
    # job_age = input("Enter job age (in days, leave blank if not needed): ").strip()
    time_map = {"month": 30, "week": 7, "hours": 1}
    # if date_posted:
    #     parts = date_posted.lower().split()
    #     if len(parts) == 2 and parts[1] in time_map:
    #         try:
    #             num = int(parts[0])
    #             date_posted=num * time_map[parts[1]]  # Convert to days
    #         except ValueError:
    #             date_posted=1  # Default to 1 day if input is invalid
    # else:
    #     date_posted=1
    date_posted=time_map.get(date_posted)
    # experience = experience_map.get(input("Enter experience (in years, leave blank if not needed): ").strip().lower(), "")
    # experience = experience_map.get(input("Enter experience (in years, leave blank if not needed): ").strip().lower(), "")
    # experience=experience_map.get(experience)
    # print("data type: ",type(experience))
    # wfhtype = wfhtype_map.get(input("Enter work type (work from office, hybrid, remote, leave blank if not needed): ").strip().lower(), "")
    wfhtype = wfhtype_map.get(remote)
    # ctc_filters = input("Enter salary ranges (in LPA, separated by commas, leave blank if not needed): ").strip().lower().split(",")
    ctc_filters = [ctcfilter_map.get(ctc.strip(), "") for ctc in ctc_filters if ctcfilter_map.get(ctc.strip(), "")]
    
    query_params = [f"{keyword}-jobs-in-{location}"]
    base_url=f"{base_url}{'/'.join(query_params)}"
    query_params = []
   
    if wfhtype: query_params.append(f"wfhType={wfhtype}")
    if experience: query_params.append(f"experience={experience}")
    if date_posted: query_params.append(f"jobAge={date_posted}")
    
    
    for ctc in ctc_filters:
        query_params.append(f"ctcFilter={ctc}")
    if(query_params is not None):
        naukri_url = f"{base_url}?{'&'.join(query_params)}"
    else:
        naukri_url = base_url
    # print(naukri_url)
    return naukri_url
