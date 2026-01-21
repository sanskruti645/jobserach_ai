from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from time import sleep
from random import randint
from Naukri.Naukri_url_generator import generate_naukri_job_url
from Naukri.Naukri_link_parser import extract_rating,parse_job_data_from_soup
from Naukri.Naukri_selenium_customiser import selenium_customiser


# options=selenium_customiser()


# url = generate_naukri_job_url()
# driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# driver.get(url)

# sleep(randint(5, 10)) 
# page_source = driver.page_source

# soup = BeautifulSoup(page_source, 'html.parser')
# page_soup = soup.find_all("div", class_="srp-jobtuple-wrapper")

# parse_job_data_from_soup(page_soup)

# driver.quit()


def naukri(keyword,location,experience,remote,ctc_filters,date_posted):
    # print(" naukri thread start")
    options=selenium_customiser()


    url = generate_naukri_job_url(keyword,location,experience,remote,ctc_filters,date_posted)
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    driver.get(url) 
    

    sleep(6) 
    page_source = driver.page_source
    

    soup = BeautifulSoup(page_source, 'html.parser')
    page_soup = soup.find_all("div", class_="srp-jobtuple-wrapper")

    naukri_jobs=parse_job_data_from_soup(page_soup)

    driver.quit()
    return naukri_jobs
