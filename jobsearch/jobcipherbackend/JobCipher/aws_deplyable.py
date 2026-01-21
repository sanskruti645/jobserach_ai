
# import threading
# from Linkedin.linkedin import linkedin
# from Naukri.naukri_selenium import naukri
# from careerjet.real_time_main import careerjet
# # User Input


# # keyword = input("Enter job keyword: ").strip()
# # location = input("Enter job location: ").strip()
# # experience = input("Enter experience level (In years, put 1 for entry level): ").strip()
# # job_type = input("Enter job type (Full-time, Part-time, Contract, Internship): ").strip().lower()
# # remote = input("Enter remote work type (On-site, Hybrid, Remote): ").strip().lower()
# # date_posted = input("Enter date posted filter (24 hours, 1 week, 1 month): ").strip().lower()
# # company = input("Enter company ID (optional, leave blank if not needed): ").strip()
# # industry = input("Enter industry filter (Software, Finance, Education): ").strip()
# # ctc_filters = input("Enter salary ranges (in LPA, separated by commas, leave blank if not needed): ").strip().lower().split(",")
# # radius = input("Enter radius in km: ").strip()

# keyword="java"
# location="india"
# experience=1
# job_type="fulltime"
# remote="on-site"
# date_posted="1 week"
# company=""
# industry=""
# ctc_filters=""
# radius="10"
# naukri_results=naukri(keyword,location,experience,remote,ctc_filters,date_posted)
# print(naukri_results)

# careetjet_results=careerjet(keyword, location, job_type, job_type, company, date_posted, radius)
# print(careetjet_results)

# linkedin_results=linkedin(keyword,location,experience,job_type,remote,date_posted,company,industry)
# # # Starting Threads
# # linkedin_thread.start()
# # naukri_thread.start()
# # careerjet_thread.start()
# # # Wait for both threads to finish
# # linkedin_thread.join()
# # naukri_thread.join()
# # careerjet_thread.join()

# print("Both job searches completed!")
# print(linkedin_results)




from flask import Flask, request, Response,jsonify
import csv
import io
from Linkedin.linkedin import linkedin
from Naukri.naukri_selenium import naukri
from careerjet.real_time_main import careerjet
from dynamo_db_store import store_user_data
from flask_cors import CORS

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})

@app.route('/job-search', methods=['POST'])
def job_search():
    data = request.json
    
    # Extract parameters
    name=data.get("name","")
    college=data.get("college","")
    branch=data.get("branch","")
    keyword = data.get("keyword", "")
    location = data.get("location", "")
    experience = data.get("experience", 1)
    job_type = data.get("job_type", "fulltime")
    remote = data.get("remote", "on-site")
    date_posted = data.get("date_posted", "1 week")
    company = data.get("company", "")
    industry = data.get("industry", "")
    ctc_filters = data.get("ctc_filters", "")
    radius = data.get("radius", "10")
    store_user_data(keyword,name,college,branch)
    # Run job search functions (returning CSV strings)
    linkedin_csv = linkedin(keyword, location, experience, job_type, remote, date_posted, company, industry)
    naukri_csv = naukri(keyword, location, experience, remote, ctc_filters, date_posted)
#    careerjet_csv = careerjet(keyword, location, job_type, job_type, company, date_posted, radius)
    print("linkedin started")
    linkedin_csv = linkedin(keyword, location, experience, job_type, remote, date_posted, company, industry)

    # Combine CSV data with section headers
#    final_output = f"Naukri Results\n{naukri_csv}\nLinkedIn Results\n{linkedin_csv}"

    # Send as a text/csv response
#    return Response(final_output, mimetype="text/csv", headers={"Content-Disposition": "attachment; filename=job_results.csv"})
    jobs_map = {
        "LinkedIn Jobs": linkedin_csv,
        "Naukri Jobs": naukri_csv
    }

    # Return the dictionary as a JSON response
    return jsonify(jobs_map)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
