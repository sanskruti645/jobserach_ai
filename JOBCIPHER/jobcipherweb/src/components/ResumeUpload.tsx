// import React from "react";

// const ResumeUpload: React.FC = () => {
//   return (
//     <div className="container bg-white p-6 rounded-lg shadow-md">
//       <h3 className="text-xl font-semibold text-primary mb-4">Resume Upload</h3>
//       <input
//         type="file"
//         id="fileInput"
//         accept="application/pdf"
//         className="w-full p-2 border border-gray-300 rounded-md"
//       />
//       <button
//         id="uploadButton"
//         className="w-full bg-primary text-white py-2 mt-4 rounded-md hover:bg-primary-dark transition"
//       >
//         Upload Resume & Search Jobs
//       </button>
//       <div id="status" className="mt-4 text-center"></div>
//     </div>
//   );
// };

// export default ResumeUpload;

import React, { useState } from "react";
import {
  handleApplyFilters as applyFiltersHandler,
  handleClearFilters,
} from "@/utils/eventHandlers";
import { useJobSearchHandler } from "@/services/jobSearchService";




const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filters, setFilters] = useState<any>({
    experience: 0,
    job_type: "",
    remote: "on-site",
    date_posted: "week",
    company: "",
    industry: "",
    ctc_filters: "",
    radius: 10,
    keyword: "",
    location: "",
  });
  const {
    status,
    linkedinJobs,
    naukriJobs,
    careerjetJobs,
    handleJobSearch,
  } = useJobSearchHandler();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    // Perform job search using resume and filters
    handleJobSearch(file, filters, true);
  };
  const handleApplyFilters = () => {
    // Perform job search using filters only (no resume)
    handleJobSearch(null, filters, false);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  


  return (
    <div className="container bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-primary mb-4">Resume Upload</h3>
      <input
        type="file"
        id="fileInput"
        accept="application/pdf"
        className="w-full p-2 border border-gray-300 rounded-md"
        onChange={handleFileChange}
      />
      <button
        id="uploadButton"
        className="w-full bg-primary text-white py-2 mt-4 rounded-md hover:bg-primary-dark transition"
        onClick={handleUpload}
      >
        Upload Resume & Search Jobs
      </button>
      <div className="mt-6">
        <h4 className="text-lg font-semibold">Filters</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="experience" className="block font-medium">
              Experience (years):
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="job_type" className="block font-medium">
              Job Type:
            </label>
            <select
              id="job_type"
              name="job_type"
              value={filters.job_type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full Time</option>
              <option value="Part-time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block font-medium">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="keyword" className="block font-medium">
              Keyword:
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          id="applyFilters"
          className="w-full bg-primary text-white py-2 mt-4 rounded-md hover:bg-primary-dark transition"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
      </div>
      <div id="status" className="mt-4 text-center">
        {status}
      </div>

      {/* Display LinkedIn Jobs */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold">LinkedIn Jobs</h4>
        {linkedinJobs.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Company</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Time Posted</th>
                <th className="border border-gray-300 p-2">Job Link</th>
              </tr>
            </thead>
            <tbody>
              {linkedinJobs.map((job, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{job.title}</td>
                  <td className="border border-gray-300 p-2">{job.company}</td>
                  <td className="border border-gray-300 p-2">{job.location}</td>
                  <td className="border border-gray-300 p-2">{job.timePosted}</td>
                  <td className="border border-gray-300 p-2">
                    <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      View Job
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No LinkedIn jobs found.</p>
        )}
      </div>

      {/* Display Naukri Jobs */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold">Naukri Jobs</h4>
        {naukriJobs.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Company</th>
                <th className="border border-gray-300 p-2">Experience</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Job Link</th>
              </tr>
            </thead>
            <tbody>
              {naukriJobs.map((job, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{job.title}</td>
                  <td className="border border-gray-300 p-2">{job.companyName}</td>
                  <td className="border border-gray-300 p-2">{job.experience}</td>
                  <td className="border border-gray-300 p-2">{job.location}</td>
                  <td className="border border-gray-300 p-2">
                    <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      View Job
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Naukri jobs found.</p>
        )}
      </div>
      {/* Display CareerJet Jobs */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold">CareerJet Jobs</h4>
        {careerjetJobs.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Company</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Summary</th>
                <th className="border border-gray-300 p-2">Job Link</th>
              </tr>
            </thead>
            <tbody>
              {careerjetJobs.map((job, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{job.title}</td>
                  <td className="border border-gray-300 p-2">{job.company}</td>
                  <td className="border border-gray-300 p-2">{job.location}</td>
                  <td className="border border-gray-300 p-2">{job.summary}</td>
                  <td className="border border-gray-300 p-2">
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      View Job
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No CareerJet jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;