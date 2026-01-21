import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { logMessage, parseCSV } from "@/utils/logger";
import { searchCareerJetJobs } from "@/services/careerjetServices";

export const useJobSearchHandler = () => {
  const [status, setStatus] = useState<string>(""); // Status message
  const [linkedinJobs, setLinkedinJobs] = useState<any[]>([]); // LinkedIn job results
  const [naukriJobs, setNaukriJobs] = useState<any[]>([]); // Naukri job results
  const [careerjetJobs, setCareerjetJobs] = useState<any[]>([]); // CareerJet job results

  /**
   * Main function to handle job search
   * @param file - Resume file (optional)
   * @param filters - Filters for job search
   * @param useResume - Flag to determine whether to use the resume
   */
  const handleJobSearch = async (file: File | null, filters: any, useResume: boolean) => {
    setStatus("Initializing job search...");
    setLinkedinJobs([]);
    setNaukriJobs([]);
    setCareerjetJobs([]);

    try {
      let jobData = { ...filters };

      // If resume is used, upload and extract data
      if (useResume && file) {
        setStatus("Uploading resume and extracting information...");
        const formData = new FormData();
        formData.append("file", file);

        const extractResponse = await fetch(`${API_BASE_URL}:5001/extract`, {
          method: "POST",
          mode: "cors",
          body: formData,
        });

        if (!extractResponse.ok) {
          throw new Error(`Resume extraction failed! Status: ${extractResponse.status}`);
        }

        const extractedData = await extractResponse.json();
        console.log("Extracted resume data:", extractedData);

        // Merge extracted data with filters
        jobData = {
          ...extractedData["extracted_info"],
          ...filters,
          keyword: filters.keyword || extractedData["extracted_info"].keyword,
          location: filters.location || extractedData["extracted_info"].location,
        };
      }

      setStatus("Searching for jobs...");

      // Search CareerJet jobs
      const careerjetResults = await searchCareerJetJobs(
        jobData.keyword,
        jobData.location,
        jobData.radius
      );
      setCareerjetJobs(careerjetResults);

      // Call LinkedIn and Naukri job search API
      const jobSearchResponse = await fetch(`${API_BASE_URL}:5000/job-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (!jobSearchResponse.ok) {
        throw new Error(`Job search failed! Status: ${jobSearchResponse.status}`);
      }

      const jobResults = await jobSearchResponse.json();
      console.log("Job search results:", jobResults);

      // Parse CSV strings into structured data
      const linkedinJobsParsed = parseCSV(jobResults["LinkedIn Jobs"]);
      const naukriJobsParsed = parseCSV(jobResults["Naukri Jobs"]);

      // Convert parsed CSV data into arrays of objects
      const linkedinJobsFormatted = linkedinJobsParsed.slice(1).map((row) => {
        const [title, company, companyLink, location, timePosted, jobLink] = row;
        return { title, company, companyLink, location, timePosted, jobLink };
      });

      const naukriJobsFormatted = naukriJobsParsed.slice(1).map((row) => {
        const [title, companyName, rating, experience, location, techStack, jobLink] = row;
        return { title, companyName, rating, experience, location, techStack, jobLink };
      });

      // Update state with job results
      setLinkedinJobs(linkedinJobsFormatted);
      setNaukriJobs(naukriJobsFormatted);

      setStatus("Job search completed successfully!");
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.log("Error during job search:", error);
    }
  };

  /**
   * Clear all job results and reset status
   */
  const clearJobResults = () => {
    setStatus("");
    setLinkedinJobs([]);
    setNaukriJobs([]);
    setCareerjetJobs([]);
  };

  return {
    status,
    linkedinJobs,
    naukriJobs,
    careerjetJobs,
    handleJobSearch,
    clearJobResults,
  };
};