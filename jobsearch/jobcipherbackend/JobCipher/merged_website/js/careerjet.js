import { PROXY_OPTIONS } from './config.js';
import { logMessage } from './utils.js';

// Store current jobs from CareerJet
let currentCareerJetJobs = [];

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
  let proxiesToTry = [...PROXY_OPTIONS];
  
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

export { 
  searchCareerJetJobs, 
  downloadCSV, 
  currentCareerJetJobs 
};