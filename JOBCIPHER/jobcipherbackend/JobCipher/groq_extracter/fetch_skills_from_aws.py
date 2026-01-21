import requests

url = "http://YOUR_EC2_IP:5001/extract"
files = {"file": open("resume.pdf", "rb")}
response = requests.post(url, files=files)

print(response.json())
