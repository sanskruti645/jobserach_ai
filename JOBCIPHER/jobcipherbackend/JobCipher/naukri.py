import requests

# Function to generate the Naukri job listing URL dynamically
def generate_naukri_url(job_title, location):
    # Format the job title and location to match the URL pattern
    job_title = job_title.strip().replace(" ", "-").lower()
    location = location.strip().replace(" ", "-").lower()

    # Construct the dynamic URL
    url = f"https://www.naukri.com/{job_title}-jobs-in-{location}"
    return url

# Function to fetch and save the HTML content of a dynamically generated Naukri page
def fetch_and_save_html(job_title, location):
    # Generate the URL dynamically
    url = generate_naukri_url(job_title, location)

    # Set headers to mimic a real user (User-Agent)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    print("url:- ",url)
    # Send a GET request to fetch the HTML content
    response = requests.get(url, headers=headers)

    # If the request was successful
    if response.status_code == 200:
        # Save the HTML content to a file
        file_path = f"{job_title}_{location}_jobs_page.html"
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(response.text)
        print(f"HTML saved to {file_path}")
    else:
        print(f"Failed to retrieve page. Status code: {response.status_code}")

if __name__ == "__main__":
    # Ask the user for the job title and location
    job_title = input("Enter the job title to scrape (e.g., machine-learning-engineer): ").strip()
    location = input("Enter the location (e.g., india): ").strip()

    # Fetch and save the HTML content for the dynamically generated URL
    fetch_and_save_html(job_title, location)
