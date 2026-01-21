import requests

# AWS EC2 Public IP
AWS_SERVER_URL = "http://your-ec2-public-ip:5000/job-search"

# Job search parameters
job_data = {
    "name":"Siddhant",
    "college":"VIT",
    "branch":"CSE",
    "keyword": "java",
    "location": "india",
    "experience": 1,
    "job_type": "fulltime",
    "remote": "on-site",
    "date_posted": "1 week",
    "company": "",
    "industry": "",
    "ctc_filters": "",
    "radius": "10"
}

# Send request to AWS
response = requests.post(AWS_SERVER_URL, json=job_data)

if response.status_code == 200:
    # Save CSV file
    with open("job_results.csv", "w", encoding="utf-8") as f:
        f.write(response.text)
    
    print("CSV file downloaded: job_results.csv")
else:
    print("Error:", response.text)
 
