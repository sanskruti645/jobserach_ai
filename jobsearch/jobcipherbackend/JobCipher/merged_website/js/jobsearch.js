import { API_BASE_URL } from './config.js';
import { displayCSV, extractResumeInfo, logMessage } from './utils.js';
import { searchCareerJetJobs } from './careerjet.js';

// Function to upload resume and search for jobs
async function uploadResumeAndSearchJobs(filters) {
  const fileInput = document.getElementById("fileInput");
  const statusElement = document.getElementById("status");
  const linkedinTable = document.getElementById("linkedinTable");
  const naukriTable = document.getElementById("naukriTable");

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select a file to upload");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  statusElement.textContent = "Uploading and Extracting Information...";
  linkedinTable.innerHTML = "";
  naukriTable.innerHTML = "";
  
  // Clear CareerJet results if they exist
  const careerjetListings = document.getElementById("careerjet-listings");
  const careerjetCount = document.getElementById("careerjet-count");
  if (careerjetListings) careerjetListings.innerHTML = "";
  if (careerjetCount) careerjetCount.innerHTML = "";

  try {
    // Extract resume data
    const extractResponse = await fetch(`${API_BASE_URL}:5001/extract`, {
      method: "POST",
      mode: "cors",
      body: formData,
    });

    if (!extractResponse.ok) {
      throw new Error(`HTTP error! Status: ${extractResponse.status}`);
    }

    const parsedData = await extractResponse.json();
    console.log("Extracted Data:", parsedData);

    // Extract information from API response
    const extractedInfo = extractResumeInfo(parsedData["extracted_info"]);

    // Merge extracted info with filter values
    const jobData = {
      ...extractedInfo,
      ...filters,
      keyword: filters.keyword ? filters.keyword : extractedInfo.keyword,
      location: filters.location ? filters.location : extractedInfo.location
    };

    statusElement.textContent = "Searching for Jobs...";
    if (careerjetListings) {
      await searchCareerJetJobs(jobData.keyword, jobData.location, jobData.radius);
    }
    // Call LinkedIn and Naukri job search API
    const jobResponse = await fetch(`${API_BASE_URL}:5000/job-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    if (!jobResponse.ok) {
      throw new Error(`Job search failed! Status: ${jobResponse.status}`);
    }

    const jobResults = await jobResponse.json();
    console.log("Job Search Response:", jobResults);

    // Display LinkedIn and Naukri job results
    displayCSV(jobResults["LinkedIn Jobs"], linkedinTable);
    displayCSV(jobResults["Naukri Jobs"], naukriTable);
    
    // Now search CareerJet with the same keyword and location
    
    
    statusElement.textContent = "Job Search Successful!";
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
    console.error("Detailed error:", error);
  }
}

export { uploadResumeAndSearchJobs };