// Global object to hold filter values
const API_BASE_URL = "http://15.207.115.90";
let filters = {
  experience: 0,
  job_type: "Full-time",
  remote: "on-site",
  date_posted: "week",
  company: "",
  industry: "",
  ctc_filters: "",
  radius: "10",
  keyword: "",
  location: ""
};

// CareerJet proxy options
const proxyOptions = [
  { name: 'corsproxy.io', url: 'https://corsproxy.io/?' },
  { name: 'allorigins.win', url: 'https://api.allorigins.win/raw?url=' },
  { name: 'codetabs.com', url: 'https://api.codetabs.com/v1/proxy?quest=' },
  { name: 'cors-anywhere (requires access)', url: 'https://cors-anywhere.herokuapp.com/' },
  { name: 'No proxy (direct request)', url: '' }
];

// Current jobs from CareerJet
let currentCareerJetJobs = [];

document.addEventListener('DOMContentLoaded', function() {
  // Populate proxy selector if it exists
  const proxySelector = document.getElementById('proxy-selector');
  if (proxySelector) {
    proxyOptions.forEach((proxy, index) => {
      const option = document.createElement('option');
      option.value = proxy.url;
      option.textContent = proxy.name;
      proxySelector.appendChild(option);
    });
  }
  
  // Set up event listeners for any CareerJet specific buttons
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      downloadCSV();
    });
  }
  
  // Debug panel toggle if it exists
  const toggleDebug = document.getElementById('toggle-debug');
  if (toggleDebug) {
    toggleDebug.addEventListener('click', function() {
      const debugPanel = document.getElementById('debug-panel');
      debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
    });
  }
});

document.getElementById("uploadButton").addEventListener("click", async function () {
  // First upload & extraction flow remains the same
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
    const extractResponse = await fetch("http://15.207.115.90:5001/extract", {
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
    const extractInfo = (infoText) => {
      // Split text into lines that start with a number and a period.
      const lines = infoText.split("\n").filter(line => /^\d+\.\s*/.test(line));
      
      // Helper function to remove the leading number and period.
      const cleanLine = (line) => {
        let text = line.replace(/^\d+\.\s*/, '').trim();
        if (text.includes(":")) {
          const parts = text.split(":");
          return parts.slice(1).join(":").trim();
        }
        return text;
      };
    
      // Additional cleaning for branch: remove any text within parentheses.
      const cleanBranch = (branchText) => branchText.replace(/\(.*?\)/g, '').trim();
    
      // Cleaning for location: if the location contains a comma, only take the first part.
      const cleanLocation = (locationText) => {
        const cleaned = locationText.trim();
        if (cleaned.includes(',')) {
          return cleaned.split(',')[0].trim();
        }
        return cleaned;
      };
    
      return {
        name: cleanLine(lines[0]) || 'N/A',
        branch: cleanBranch(cleanLine(lines[1])) || 'CSE',
        college: cleanLine(lines[2]) || 'N/A',
        keyword: cleanLine(lines[3]) || 'Python',
        location: cleanLocation(cleanLine(lines[4])) || 'India',
      };
    };
    
    const extractedInfo = extractInfo(parsedData["extracted_info"]);

    // Merge extracted info with filter values
    const jobData = {
      ...extractedInfo,
      ...filters,
      keyword: filters.keyword ? filters.keyword : extractedInfo.keyword,
      location: filters.location ? filters.location : extractedInfo.location
    };

    statusElement.textContent = "Searching for Jobs...";

    // Call LinkedIn and Naukri job search API
    const jobResponse = await fetch("http://15.207.115.90:5000/job-search", {
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
    if (careerjetListings) {
      await searchCareerJetJobs(jobData.keyword, jobData.location, jobData.radius);
    }
    
    statusElement.textContent = "Job Search Successful!";
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
    console.error("Detailed error:", error);
  }
});

// Function to search CareerJet jobs
async function searchCareerJetJobs(keyword, location, radius = "10") {
  // Show loader if it exists
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'block';
  
  const careerjetListings = document.getElementById("careerjet-listings");
  const careerjetCount = document.getElementById("careerjet-count");
  
  if (!careerjetListings) return; // Exit if CareerJet elements don't exist
  
  careerjetListings.innerHTML = '';
  if (careerjetCount) careerjetCount.innerHTML = '';
  
  // Get download button if it exists
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) downloadBtn.disabled = true;
  
  // Generate CareerJet URL
  const targetUrl = generateCareerjetUrl(keyword, location, "", "", "", "", radius);
  logMessage(`Generated URL: ${targetUrl}`);
  
  // Try each proxy in sequence
  let proxiesToTry = [...proxyOptions];
  
  // Get selected proxy if proxy selector exists
  const proxySelector = document.getElementById('proxy-selector');
  let selectedProxyUrl = '';
  
  if (proxySelector) {
    selectedProxyUrl = proxySelector.value;
    
    // Find the index of the selected proxy
    const selectedProxyIndex = proxiesToTry.findIndex(proxy => proxy.url === selectedProxyUrl);
    
    // If found, move it to the front of the array
    if (selectedProxyIndex !== -1) {
      const selectedProxy = proxiesToTry.splice(selectedProxyIndex, 1)[0];
      proxiesToTry.unshift(selectedProxy);
    }
  }
  
  logMessage(`Will try ${proxiesToTry.length} proxies in sequence until successful`);
  
  // Try each proxy in sequence until one works
  for (let i = 0; i < proxiesToTry.length; i++) {
    const proxy = proxiesToTry[i];
    
    logMessage(`Trying proxy ${i+1}/${proxiesToTry.length}: ${proxy.name}`);
    
    // Update UI to show which proxy is being tried (if element exists)
    const currentProxyElement = document.getElementById('current-proxy');
    if (currentProxyElement) {
      currentProxyElement.textContent = proxy.url ? 
        `Trying proxy: ${proxy.name}` : 'Trying direct request (no proxy)';
    }
    
    try {
      // Use the CORS proxy to fetch the page
      const url = proxy.url ? `${proxy.url}${encodeURIComponent(targetUrl)}` : targetUrl;
      
      logMessage(`Requesting: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      logMessage(`Received ${html.length} bytes of HTML`);
      
      // Parse the HTML and extract job listings
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const jobElements = doc.querySelectorAll("article.job.clicky");
      logMessage(`Found ${jobElements.length} job elements`);
      
      // If we found jobs, process them
      if (jobElements.length > 0) {
        const extractedJobs = [];
        
        jobElements.forEach((job, index) => {
          const titleElement = job.querySelector("h2 a");
          const companyElement = job.querySelector("p.company");
          const locationElement = job.querySelector("ul.location li");
          const summaryElement = job.querySelector("div.desc");
          
          if (titleElement) {
            const title = titleElement.textContent.trim();
            const company = companyElement ? companyElement.textContent.trim() : "N/A";
            const location = locationElement ? locationElement.textContent.trim() : "N/A";
            const summary = summaryElement ? summaryElement.textContent.trim() : "N/A";
            const url = titleElement.getAttribute("href");
            
            extractedJobs.push({
              title,
              company,
              location,
              summary,
              url: url.startsWith("http") ? url : `https://www.careerjet.co.in${url}`
            });
            
            logMessage(`Extracted job ${index+1}: ${title} at ${company}`);
          }
        });
        
        // Display results and save current jobs
        displayCareerJetResults(extractedJobs);
        currentCareerJetJobs = extractedJobs;
        
        // Update UI to show which proxy was successful
        if (currentProxyElement) {
          currentProxyElement.textContent = `Successfully used proxy: ${proxy.name}`;
        }
        
        // Enable download button if we have results and it exists
        if (downloadBtn) downloadBtn.disabled = currentCareerJetJobs.length === 0;
        
        // If we got results, break out of the loop
        logMessage(`Successfully retrieved ${extractedJobs.length} jobs using proxy: ${proxy.name}`);
        break;
      } else {
        logMessage(`No job listings found with proxy: ${proxy.name}, trying next proxy...`);
      }
      
    } catch (error) {
      logMessage(`Error with proxy ${proxy.name}: ${error.message}`);
      console.error('Error fetching jobs with proxy:', proxy.name, error);
      
      // If this is the last proxy in the list
      if (i === proxiesToTry.length - 1) {
        careerjetListings.innerHTML = `
          <div class="error">
            <p>An error occurred while fetching CareerJet job listings.</p>
            <p>Error details: ${error.message}</p>
            <p>All available proxies have been tried without success. This may be due to CORS restrictions or the target website being unavailable.</p>
          </div>
        `;
      }
      // Otherwise, continue to the next proxy
    }
  }
  
  // Hide loader if it exists
  if (loader) loader.style.display = 'none';
}

// Function to generate CareerJet URL
function generateCareerjetUrl(keyword = "", location = "", contractType = "", workingHours = "", company = "", datePosted = "", radius = "") {
  const baseUrl = "https://www.careerjet.co.in/jobs?";
  
  // Convert all inputs to lowercase
  keyword = keyword.toLowerCase();
  location = location.toLowerCase();
  contractType = contractType.toLowerCase();
  workingHours = workingHours.toLowerCase();
  company = company.toLowerCase();
  datePosted = datePosted.toLowerCase();
  radius = radius.toLowerCase();
  
  // Mapping based on provided values
  const contractTypeMap = {"internship": "i", "contract": "c", "permanent": "p"};
  const workingHoursMap = {"full-time": "f", "part-time": "p"};
  const datePostedMap = {"24 hours": "1", "1 week": "7", "1 month": "30"};
  
  // Convert user input to corresponding values
  contractType = contractTypeMap[contractType] || "";
  workingHours = workingHoursMap[workingHours] || "";
  datePosted = datePostedMap[datePosted] || "";
  
  // Replace spaces in keyword with "+"
  keyword = keyword.replace(/ /g, "+");
  
  // Parameters dictionary
  const params = {
    "s": keyword,
    "l": location,
    "ct": contractType,
    "cp": workingHours,
    "cmp": company,
    "nw": datePosted,
    "radius": radius
  };

  // Build query string
  const queryString = Object.entries(params)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
    
  return baseUrl + queryString;
}

// Function to display CareerJet results
function displayCareerJetResults(jobs) {
  const careerjetListings = document.getElementById("careerjet-listings");
  const careerjetCount = document.getElementById("careerjet-count");
  
  if (!careerjetListings) return; // Exit if element doesn't exist
  
  // Clear previous results
  careerjetListings.innerHTML = '';
  
  // Display count if element exists
  if (careerjetCount) {
    careerjetCount.textContent = jobs.length === 0 
      ? 'No jobs found on CareerJet' 
      : `Found ${jobs.length} job${jobs.length === 1 ? '' : 's'} on CareerJet`;
  }
  
  // Display each job
  jobs.forEach(job => {
    const jobElement = document.createElement('div');
    jobElement.className = 'job-card';
    
    jobElement.innerHTML = `
      <h3 class="job-title">${job.title}</h3>
      <p class="job-company">${job.company}</p>
      <p class="job-location">${job.location}</p>
      <div class="job-summary">${job.summary}</div>
      <a href="${job.url}" target="_blank" class="job-link">View Job</a>
    `;
    
    careerjetListings.appendChild(jobElement);
  });
}

// Function to download CSV of CareerJet jobs
function downloadCSV() {
  if (currentCareerJetJobs.length === 0) return;
  
  // Create CSV content
  const headers = ['Title', 'Company', 'Location', 'Summary', 'Job URL'];
  let csvContent = headers.join(',') + '\n';
  
  currentCareerJetJobs.forEach(job => {
    // Escape fields that might contain commas
    const escapedTitle = `"${job.title.replace(/"/g, '""')}"`;
    const escapedCompany = `"${job.company.replace(/"/g, '""')}"`;
    const escapedLocation = `"${job.location.replace(/"/g, '""')}"`;
    const escapedSummary = `"${job.summary.replace(/"/g, '""')}"`;
    const escapedUrl = `"${job.url}"`;
    
    const row = [
      escapedTitle,
      escapedCompany,
      escapedLocation,
      escapedSummary,
      escapedUrl
    ].join(',');
    
    csvContent += row + '\n';
  });
  
  // Create a download link
  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `careerjet-jobs-${Date.now()}.csv`);
  document.body.appendChild(link);
  
  // Click the link to trigger download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
}

// Listen for Apply Filters button click
document.getElementById("applyFilters").addEventListener("click", async function () {
  // Update the global filters object with values from the form
  filters = {
    experience: document.getElementById("experience").value,
    job_type: document.getElementById("job_type").value,
    remote: document.getElementById("remote").value,
    date_posted: document.getElementById("date_posted").value,
    company: document.getElementById("company").value,
    industry: document.getElementById("industry").value,
    ctc_filters: document.getElementById("ctc_filters").value,
    radius: document.getElementById("radius").value,
    keyword: document.getElementById("keyword").value,       // Keyword filter value
    location: document.getElementById("filterLocation").value  // Location filter value
  };

  // Call the upload button handler to search with updated filters
  document.getElementById("uploadButton").click();
});

// Listen for Clear Filters button click
document.getElementById("clearFilters").addEventListener("click", function () {
  document.getElementById("filterForm").reset();
  // Reset filters object to default values
  filters = {
    experience: 0,
    job_type: "Full-time",
    remote: "on-site",
    date_posted: "week",
    company: "",
    industry: "",
    ctc_filters: "",
    radius: "10",
    keyword: "",
    location: ""
  };
});

// CSV parsing function
function parseCSV(csvString) {
  if (!csvString || csvString.trim() === "") return [];
  const lines = csvString.split(/\r?\n/).filter(line => line.trim() !== "");
  return lines.map(line => line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(cell => cell.replace(/^"(.*)"$/, "$1")));
}

// Display CSV data in a table
function displayCSV(csvString, tableElement) {
  tableElement.innerHTML = "";
  const rows = parseCSV(csvString);
  if (rows.length === 0) {
    tableElement.innerHTML = "<tr><td>No jobs found</td></tr>";
    return;
  }

  // Create header row
  const headerRow = document.createElement("tr");
  rows[0].forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  tableElement.appendChild(headerRow);

  // Create data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell || "";
      tr.appendChild(td);
    });
    tableElement.appendChild(tr);
  }
}

// Company reviews functionality
document.getElementById("getReviewsButton").addEventListener("click", function () {
  const companyReview = document.getElementById("companyReviewInput").value;
  if (!companyReview.trim()) {
    alert("Please enter a company name for reviews.");
    return;
  }

  // Open a new tab to display company reviews.
  const reviewTab = window.open("", "ReviewTab");
  reviewTab.document.write("<p>Loading reviews...</p>");

  // Call your Flask API for reviews
  fetch("http://15.207.115.90:5002/get_reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company_name: companyReview })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (!data.review) {
      reviewTab.document.write("<h2>Error: No review data found.</h2>");
      return;
    }
    const reviews = data.review.reviews || {};
    const links = data.review.links || {};
    
    let htmlContent = `<h2>Reviews for ${companyReview}</h2>`;
    for (const platform in reviews) {
      htmlContent += `<h3>${platform}</h3>`;
      htmlContent += `<p>${reviews[platform]}</p>`;
      htmlContent += `<a href="${links[platform]}" target="_blank">Read more on ${platform}</a><br><br>`;
    }
    reviewTab.document.body.innerHTML = htmlContent;
  })
  .catch(error => {
    reviewTab.document.write(`<h2>Error fetching reviews: ${error.message}</h2>`);
    console.error("Review fetch error:", error);
  });
});

// Debug logging function
function logMessage(message) {
  const debugLog = document.getElementById('debug-log');
  if (debugLog) {
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    debugLog.appendChild(logEntry);
    // Scroll to bottom
    debugLog.scrollTop = debugLog.scrollHeight;
  }
  console.log(message);
}