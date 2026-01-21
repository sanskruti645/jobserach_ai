import { DEFAULT_FILTERS, PROXY_OPTIONS } from './config.js';
import { logMessage } from './utils.js';
import { searchCareerJetJobs, downloadCSV } from './careerjet.js';
import { getCompanyReviews } from './reviews.js';
import { uploadResumeAndSearchJobs } from './jobsearch.js';
import { initJobAlerts } from './jobalert.js';

// Current filters state
let filters = { ...DEFAULT_FILTERS };

// Initialize event listeners once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize job alerts functionality
  initJobAlerts();
  
  // Populate proxy selector if it exists
  const proxySelector = document.getElementById('proxy-selector');
  if (proxySelector) {
    PROXY_OPTIONS.forEach((proxy, index) => {
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
  
  // Upload button click handler
  document.getElementById("uploadButton").addEventListener("click", function() {
    uploadResumeAndSearchJobs(filters);
  });
  
  // Apply filters button click handler
  document.getElementById("applyFilters").addEventListener("click", function() {
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
      keyword: document.getElementById("keyword").value,
      location: document.getElementById("filterLocation").value
    };

    // Call the upload button handler to search with updated filters
    document.getElementById("uploadButton").click();
  });
  
  // Clear filters button click handler
  document.getElementById("clearFilters").addEventListener("click", function() {
    document.getElementById("filterForm").reset();
    // Reset filters object to default values
    filters = { ...DEFAULT_FILTERS };
  });
  
  // Company reviews button click handler
  document.getElementById("getReviewsButton").addEventListener("click", function() {
    const companyReview = document.getElementById("companyReviewInput").value;
    getCompanyReviews(companyReview);
  });
});