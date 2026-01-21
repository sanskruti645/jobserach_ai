from Linkedin.linkedin import linkedin
from Naukri.naukri_selenium import naukri
from flask import Flask, request, Response
from dynamo_db_store import store_user_data


app = Flask(__name__)

@app.route('/job-search', methods=['POST'])
def job_search():
    data = request.json
    
    name = data.get("name", "")
    college = data.get("college", "")
    branch = data.get("branch", "")
    # Extract parameters
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
    store_user_data(keyword, name,college,branch)
    

    naukri_csv=naukri(keyword,location,experience,remote,ctc_filters,date_posted)
    linkedin_csv=linkedin(keyword,location,experience,job_type,remote,date_posted,company,industry)
    final_output = f"Naukri Results\n{naukri_csv}\n\nLinkedIn Results\n{linkedin_csv}"

    # Send as a text/csv response
    return Response(final_output, mimetype="text/csv", headers={"Content-Disposition": "attachment; filename=job_results.csv"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)




