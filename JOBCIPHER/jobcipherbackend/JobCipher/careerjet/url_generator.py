def generate_careerjet_url(keyword="", location="", contract_type="", working_hours="", company="", date_posted="", radius=""):
    base_url = "https://www.careerjet.co.in/jobs?"
    
    # Convert all inputs to lowercase
    keyword = keyword.lower()
    location = location.lower()
    contract_type = contract_type.lower()
    working_hours = working_hours.lower()
    company = company.lower()
    date_posted = date_posted.lower()
    radius = radius.lower()
    
    # Mapping based on provided values
    contract_type_map = {"internship": "i", "contract": "c", "permanent": "p"}
    working_hours_map = {"full-time": "f", "part-time": "p"}
    date_posted_map = {"24 hours": "1", "1 week": "7", "1 month": "30"}
    
    # Convert user input to corresponding values
    contract_type = contract_type_map.get(contract_type, "")
    working_hours = working_hours_map.get(working_hours, "")
    date_posted = date_posted_map.get(date_posted, "")
    
    # Replace spaces in keyword with "+"
    keyword = keyword.replace(" ", "+")
    

    # Parameters dictionary
    params = {
        "s": keyword,
        "l": location,
        "ct": contract_type,
        "cp": working_hours,
        "cmp": company,
        "nw": date_posted,
        "radius": radius
    }

    query_string = "&".join([f"{key}={value}" for key, value in params.items() if value])
    return base_url + query_string


