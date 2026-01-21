from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from time import sleep
from random import randint

# Function to generate the job search URL
def generate_naukri_job_url():
    """Generates a Naukri.com job search URL based on user input."""
    base_url = "https://www.naukri.com/"
    
    keyword = input("Enter job keyword: ").strip().replace(" ", "-")
    location = input("Enter job location: ").strip().replace(" ", "-")
    
    experience_map = {f"{i} years": str(i) for i in range(1, 31)}
    wfhtype_map = {"work from office": "0", "hybrid": "3", "remote": "2"}
    ctcfilter_map = {"3": "0to3", "6": "3to6", "10": "6to10", "15": "10to15", "25": "15to25", "50": "25to50"}
    
    job_age = input("Enter job age (in days, leave blank if not needed): ").strip()
    experience = experience_map.get(input("Enter experience (in years, leave blank if not needed): ").strip().lower(), "")
    wfhtype = wfhtype_map.get(input("Enter work type (work from office, hybrid, remote, leave blank if not needed): ").strip().lower(), "")
    
    ctc_filters = input("Enter salary ranges (in LPA, separated by commas, leave blank if not needed): ").strip().lower().split(",")
    ctc_filters = [ctcfilter_map.get(ctc.strip(), "") for ctc in ctc_filters if ctcfilter_map.get(ctc.strip(), "")]
    
    query_params = [f"{keyword}-jobs-in-{location}"]
    base_url=f"{base_url}{'/'.join(query_params)}"
    query_params = []
   
    if job_age: query_params.append(f"jobAge={job_age}")
    if experience: query_params.append(f"experience={experience}")
    if wfhtype: query_params.append(f"wfhType={wfhtype}")
    for ctc in ctc_filters:
        query_params.append(f"ctcFilter={ctc}")
    if(query_params is not None):
        naukri_url = f"{base_url}?{'&'.join(query_params)}"
    else:
        naukri_url = base_url
    print(naukri_url)
    return naukri_url

def extract_rating(rating_a):
    if rating_a is None or rating_a.find('span', class_="main-2") is None:
        return "None"
    else:
        return rating_a.find('span', class_="main-2").text

# Function to parse job data from the soup object
def parse_job_data_from_soup(page_jobs):
    print("********PAGE_JOBS***********")
    for job in page_jobs:
        job = BeautifulSoup(str(job), 'html.parser')
        row1 = job.find('div', class_="row1")
        row2 = job.find('div', class_="row2")
        row3 = job.find('div', class_="row3")
        row4 = job.find('div', class_="row4")
        row5 = job.find('div', class_="row5")
        row6 = job.find('div', class_="row6")
        
        job_title = row1.a.text
        company_name = row2.span.a.text
        rating_a = row2.span
        rating = extract_rating(rating_a)
        
        job_details = row3.find('div', class_="job-details")
        ex_wrap = job_details.find('span', class_="exp-wrap").span.span.text
        location = job_details.find('span', class_="loc-wrap ver-line").span.span.text

        min_requirements = row4.span.text

        all_tech_stack = []
        for tech_stack in row5.ul.find_all('li', class_="dot-gt tag-li "):
            tech_stack = tech_stack.text
            all_tech_stack.append(tech_stack)

        print(f"Job Title : {job_title}")
        print(f"Company Name : {company_name}")
        print(f"Rating : {rating}")
        print(f"Experience : {ex_wrap}")
        print(f"Location : {location}")
        print(f"Minimum Requirements : {min_requirements}")
        print(f"All Tech Stack : {all_tech_stack}")
        print("***************END***************")
    print("********PAGE_JOBS END***********")

# Chrome options to run in headless mode (without GUI)
options = Options()
options.add_argument('--headless=new')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)
options.add_argument("--enable-unsafe-swiftshader")


# Setting up the Chrome WebDriver

# Start scraping from page 1 and go up to page 2
start_page = 1
page_end = 2

url = generate_naukri_job_url()
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

driver.get(url)

# Sleep to let the page load fully, simulating human behavior
sleep(randint(5, 10))  # Random sleep for the page to load fully

# Fetch the page source
page_source = driver.page_source
# print(page_source)

# Generate the soup to parse
soup = BeautifulSoup(page_source, 'html.parser')
page_soup = soup.find_all("div", class_="srp-jobtuple-wrapper")

# Parse the job data from the soup object
parse_job_data_from_soup(page_soup)

# Close the driver after the job scraping is done
driver.quit()
