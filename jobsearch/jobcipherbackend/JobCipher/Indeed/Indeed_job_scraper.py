from bs4 import BeautifulSoup
import json
import re
import time
from Ineed_driver_setup import setup_driver

def scrape_indeed_jobs(url):
    driver = setup_driver()
    driver.get(url)
    time.sleep(5)  # Allow page to load

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    # Find the script containing JSON data
    script_tag = soup.find('script', string=re.compile('window._initialData'))
    if not script_tag:
        print("Could not find JSON data script tag")
        return []

    # Extract and parse JSON data
    json_data = re.search(r'window\._initialData\s*=\s*({.*?});', script_tag.string, re.DOTALL)
    if not json_data:
        print("Could not extract JSON data")
        return []

    try:
        data = json.loads(json_data.group(1))
        job_data = data.get('jobInfoWrapperModel', {})
    except json.JSONDecodeError:
        print("Failed to parse JSON data")
        return []

    # Extract job details from JSON
    job_info = {
        "Job Title": job_data.get('jobInfoHeaderModel', {}).get('jobTitle', 'N/A'),
        "Company": job_data.get('jobInfoHeaderModel', {}).get('companyName', 'N/A'),
        "Location": job_data.get('jobInfoHeaderModel', {}).get('formattedLocation', 'N/A'),
        "Salary": job_data.get('jobInfoModel', {}).get('sanitizedJobDescription', {}).get('text', 'N/A').split('Pay: ')[-1].split('\\n')[0],
        "Job Type": ', '.join([jt.get('label', '') for jt in job_data.get('jobTypes', [])]),
        "Date Posted": job_data.get('hiringInsightsModel', {}).get('age', 'N/A'),
        "Job Link": url,
        "Description": job_data.get('jobInfoModel', {}).get('sanitizedJobDescription', {}).get('text', 'N/A')
    }

    # Clean salary information
    if 'Up to' in job_info["Salary"]:
        job_info["Salary"] = job_info["Salary"].replace('\\u20b9', '₹')
    
    return [job_info]

# Example usage:
# print(scrape_indeed_jobs("https://in.indeed.com/viewjob?jk=9824e418e9390573"))