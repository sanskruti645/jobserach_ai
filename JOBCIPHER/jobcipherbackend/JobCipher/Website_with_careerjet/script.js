// Global object to hold filter values
const API_BASE_URL = "http://65.0.131.254";
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

document.getElementById("uploadButton").addEventListener("click", async function () {
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

  try {
    // Extract resume data
    const extractResponse = await fetch("http://65.0.131.254:5001/extract", {
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
      const lines = infoText.split("\n").filter(line => /^\d+\.\s*/.test(line));
      const cleanLine = (line) => {
        let text = line.replace(/^\d+\.\s*/, '').trim();
        if (text.includes(":")) {
          const parts = text.split(":");
          return parts.slice(1).join(":").trim();
        }
        return text;
      };

      const cleanBranch = (branchText) => branchText.replace(/\(.*?\)/g, '').trim();
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

    // Call job search API
    const jobResponse = await fetch("http://65.0.131.254:5000/job-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    if (!jobResponse.ok) {
      throw new Error(`Job search failed! Status: ${jobResponse.status}`);
    }

    const jobResults = await jobResponse.json();
    console.log("Job Search Response:", jobResults);

    // Display job results
    displayCSV(jobResults["LinkedIn Jobs"], linkedinTable);
    displayCSV(jobResults["Naukri Jobs"], naukriTable);
    statusElement.textContent = "Job Search Successful!";
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
    console.error("Detailed error:", error);
  }
});

// Listen for Apply Filters button click
document.getElementById("applyFilters").addEventListener("click", async function () {
  filters = {
    experience: document.getElementById("experience").value,
    job_type: document.getElementById("job_type").value,
    remote: document.getElementById("remote").value,
    date_posted: document.getElementById("date_posted").value,
    company: document.getElementById("company").value,
    industry: document.getElementById("industry").value,
    ctc_filters: document.getElementById("ctc_filters").value,
    radius: document.getElementById("radius").value,
    keyword: document.getElementById("keyword").value,
    location: document.getElementById("filterLocation").value
  };
  document.getElementById("uploadButton").click();
});

// Listen for Clear Filters button click
document.getElementById("clearFilters").addEventListener("click", function () {
  document.getElementById("filterForm").reset();
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
  const headerRow = document.createElement("tr");
  rows[0].forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  tableElement.appendChild(headerRow);
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

// Careerjet: URL generator function (mirroring Python logic)
function generateCareerjetUrl(keyword = "", location = "", contract_type = "", working_hours = "", company = "", date_posted = "", radius = "") {
  const baseUrl = "https://www.careerjet.co.in/jobs?";
  keyword = keyword.toLowerCase();
  location = location.toLowerCase();
  contract_type = contract_type.toLowerCase();
  working_hours = working_hours.toLowerCase();
  company = company.toLowerCase();
  date_posted = date_posted.toLowerCase();
  radius = radius.toLowerCase();

  const contract_type_map = { "internship": "i", "contract": "c", "permanent": "p" };
  const working_hours_map = { "full-time": "f", "part-time": "p" };
  const date_posted_map = { "24 hours": "1", "1 week": "7", "1 month": "30" };

  contract_type = contract_type_map[contract_type] || "";
  working_hours = working_hours_map[working_hours] || "";
  date_posted = date_posted_map[date_posted] || "";

  keyword = keyword.replace(/\s+/g, "+");

  const params = new URLSearchParams();
  if (keyword) params.append("s", keyword);
  if (location) params.append("l", location);
  if (contract_type) params.append("ct", contract_type);
  if (working_hours) params.append("cp", working_hours);
  if (company) params.append("cmp", company);
  if (date_posted) params.append("nw", date_posted);
  if (radius) params.append("radius", radius);

  return baseUrl + params.toString();
}

// Careerjet: Scraping function
async function careerjetScrape(keyword, location, contract_type, working_hours, company, date_posted, radius) {
  const url = generateCareerjetUrl(keyword, location, contract_type, working_hours, company, date_posted, radius);
  console.log("Scraping Careerjet URL:", url);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const jobArticles = doc.querySelectorAll("article.job.clicky");
    let jobListings = [];
    jobArticles.forEach(job => {
      const titleElem = job.querySelector("h2 a");
      const companyElem = job.querySelector("p.company");
      const locationElem = job.querySelector("ul.location li");
      const summaryElem = job.querySelector("div.desc");

      const title = titleElem ? titleElem.textContent.trim() : "N/A";
      const companyName = companyElem ? companyElem.textContent.trim() : "N/A";
      const jobLocation = locationElem ? locationElem.textContent.trim() : "N/A";
      const summary = summaryElem ? summaryElem.textContent.trim() : "N/A";
      const relativeUrl = titleElem && titleElem.getAttribute("href") ? titleElem.getAttribute("href") : "";
      const jobUrl = relativeUrl ? "https://www.careerjet.co.in" + relativeUrl : "N/A";

      jobListings.push({
        Title: title,
        Company: companyName,
        Location: jobLocation,
        Summary: summary,
        "Job URL": jobUrl
      });
    });

    let csv = "Title,Company,Location,Summary,Job URL\n";
    jobListings.forEach(job => {
      const row = [job.Title, job.Company, job.Location, job.Summary, job["Job URL"]]
        .map(val => `"${val.replace(/"/g, '""')}"`)
        .join(",");
      csv += row + "\n";
    });
    return csv;
  } catch (error) {
    console.error("Error scraping Careerjet:", error);
    return "";
  }
}

// Integration: trigger Careerjet scraping with a button click
document.getElementById("careerjetButton")?.addEventListener("click", async function () {
  const keyword = document.getElementById("keyword").value || "Java Developer";
  const location = document.getElementById("filterLocation").value || "Bangalore";
  // Using the same parameters as in the Python code conversion:
  const contract_type = "";
  const working_hours = "";
  const company = "";
  const date_posted = "24 hours";
  const radius = "10";

  const careerjetStatus = document.getElementById("careerjetOutput");
  careerjetStatus.textContent = "Scraping Careerjet jobs...";

  const csvData = await careerjetScrape(keyword, location, contract_type, working_hours, company, date_posted, radius);
  console.log("Scraped CSV Data:", csvData);
  careerjetStatus.textContent = "Careerjet scraping complete. Check console for CSV data.";
});
