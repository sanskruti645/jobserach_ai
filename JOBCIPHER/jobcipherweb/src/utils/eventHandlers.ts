import { DEFAULT_FILTERS, PROXY_OPTIONS } from "@/config";
import { logMessage } from "@/utils/logger";
import { searchCareerJetJobs, downloadCSV } from "@/services/careerjetServices";
import { getCompanyReviews } from "@/services/reviewsService";
import { useJobSearchHandler } from "@/services/jobSearchService";
import React, { useState } from "react";

// Current filters state
let filters = { ...DEFAULT_FILTERS };

// Initialize proxy selector
export const initProxySelector = (proxySelector: HTMLSelectElement | null) => {
  if (proxySelector) {
    PROXY_OPTIONS.forEach((proxy) => {
      const option = document.createElement("option");
      option.value = proxy.url;
      option.textContent = proxy.name;
      proxySelector.appendChild(option);
    });
  }
};

// Handle download CSV button click
export const handleDownloadCSV = () => {
  downloadCSV();
};

// Handle debug panel toggle
export const toggleDebugPanel = (debugPanel: HTMLElement | null) => {
  if (debugPanel) {
    debugPanel.style.display = debugPanel.style.display === "none" ? "block" : "none";
  }
};

// Handle resume upload and job search
// Handle resume upload and job search
export const handleUploadResumeAndSearchJobs = async (
    file: File | null,
    filters: any,
    useResume: boolean,
    handleJobSearch: Function // Accept handleJobSearch as a parameter
  ) => {
    
  
    try {
      if (useResume && !file) {
        alert("Please select a file to upload.");
        return;
      }
  
      // Trigger job search with or without resume
      await handleJobSearch(file, filters, useResume);
    } catch (error) {
      logMessage(`Error during job search: ${error.message}`);
    }
  };

// Handle apply filters button click
export const handleApplyFilters = async (filters: any, handleJobSearch: Function) => {
  try {
    // Trigger job search using filters only (no resume)
    await handleJobSearch(null, filters, false);
  } catch (error: any) {
    logMessage(`Error during job search: ${error.message}`);
  }
};
  

// Handle clear filters button click
export const handleClearFilters = () => {
  const filterForm = document.getElementById("filterForm") as HTMLFormElement;
  if (filterForm) filterForm.reset();
  filters = { ...DEFAULT_FILTERS };
};

// Handle company reviews button click
export const handleGetCompanyReviews = () => {
  const companyReviewInput = document.getElementById("companyReviewInput") as HTMLInputElement;
  if (companyReviewInput) {
    const companyReview = companyReviewInput.value;
    getCompanyReviews(companyReview);
  }
};

