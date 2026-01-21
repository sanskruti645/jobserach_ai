from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from tabulate import tabulate  # For tabular output
import time
import urllib.parse  # To encode job role and location for the URL

# Set up Selenium with headless mode
def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Avoid detection
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    # Initialize the WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    return driver

# Generate Indeed URL based on job role, location, and additional filters
def generate_indeed_url_india(job_role, location, date_posted=None):
    base_url = "https://in.indeed.com/jobs?"
    query_params = {
        "q": job_role,  # Job role
        "l": location,  # Location
        "fromage": date_posted if date_posted else "",  # Date posted filter (e.g., "1" for last day)
    }
    # Encode the query parameters
    encoded_params = urllib.parse.urlencode(query_params)
    return base_url + encoded_params

# Scrape job listings from Indeed
def scrape_indeed_jobs(url):
    driver = setup_driver()
    driver.get(url)

    # Wait for the page to load (adjust the sleep time if needed)
    time.sleep(5)

    # Get the page source and parse it with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()  # Close the browser

    # Find the job listings container
    allData = soup.find("div", {"class": "mosaic-provider-jobcards"})

    if allData is None:
        print("Could not find the job listings container. The HTML structure might have changed.")
        return []

    # Extract job listings
    job_listings = []
    alllitags = allData.find_all("li", {"class": "eu4oa1w0"})

    for job in alllitags:
        job_info = {}
        try:
            job_info["Job Title"] = job.find("a").find("span").text.strip()
        except:
            job_info["Job Title"] = "N/A"

        try:
            job_info["Company"] = job.find("span", {"data-testid": "company-name"}).text.strip()
        except:
            job_info["Company"] = "N/A"

        try:
            job_info["Location"] = job.find("div", {"data-testid": "text-location"}).text.strip()
        except:
            job_info["Location"] = "N/A"

        try:
            job_link = job.find("a", href=True)["href"]
            job_info["Job Link"] = f"https://in.indeed.com{job_link}"
        except:
            job_info["Job Link"] = "N/A"

        try:
            date_posted = job.find("span", {"class": "date"}).text.strip()
            job_info["Date Posted"] = date_posted
        except:
            job_info["Date Posted"] = "N/A"

        job_listings.append(job_info)

    return job_listings

# Main function
if __name__ == "__main__":
    # Get user input for job role, location, and additional filters
    job_role = input("Enter the job role (e.g., Python Developer): ")
    location = input("Enter the location (e.g., Bengaluru, Karnataka): ")
    
   
    valid_fromage_values = ["1", "3", "7", "14"]
    date_posted_filter = input(
        "Enter how recent jobs should be posted (1 for last day, 3 for last three days, "
        "7 for last seven days, 14 for last two weeks): ")
    
    if date_posted_filter not in valid_fromage_values:
        print(f"Invalid value entered for date posted. Defaulting to '14' (last two weeks).")
        date_posted_filter = "14"
    # Generate the Indeed URL for India with additional filters
    target_url = generate_indeed_url_india(job_role, location,  date_posted=date_posted_filter)
    
    print(f"Scraping job listings from: {target_url}")

    # Scrape job listings
    jobs = scrape_indeed_jobs(target_url)

    # Print the scraped job listings in a tabular format
    # if jobs:
    #     print(tabulate(jobs, headers="keys", tablefmt="grid"))
    # else:
    #     print("No jobs found.")

    # Print the scraped job listings in a tabular format
    for job in jobs:
        if job["Job Title"]!="N/A":
            print(job)
            print("-"*50)
