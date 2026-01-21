// Global object to hold filter values
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
    location: ""      // New location filter field (empty by default)
  };
  
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
  
    try {
      // Extract resume data
      const extractResponse = await fetch("http://43.204.110.97:5001/extract", {
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
        // If a colon is present, returns the text after the colon; otherwise, returns the cleaned text.
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
  
      // Call job search API
      const jobResponse = await fetch("http://43.204.110.97:5000/job-search", {
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
      keyword: document.getElementById("keyword").value,       // New keyword filter value
    location: document.getElementById("filterLocation").value  // New location filter value
    };
  
    // Call the job search API again using the updated filters
    // (Assuming that resume info is already extracted, you might store it globally)
    // For simplicity, we'll call the upload button handler again.
    document.getElementById("uploadButton").click();
  });
  
  // Listen for Clear Filters button click
  document.getElementById("clearFilters").addEventListener("click", function () {
    document.getElementById("filterForm").reset();
    // Reset filters object to default values
    filters = {
      experience: 0,
      job_type: "fulltime",
      remote: "on-site",
      date_posted: "1 week",
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
  