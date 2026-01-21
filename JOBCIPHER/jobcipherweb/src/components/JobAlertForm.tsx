import React, { useEffect } from "react";
// import { initializeJobAlerts } from "@/utils/eventHandlers";
const JobAlertForm: React.FC = () => {
  // useEffect(() => {
  //   initializeJobAlerts();
  // }, []);
  return (
    <div className="job-alert-section bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-primary mb-4">Create Job Alert</h2>
      <form id="jobAlertForm" className="space-y-4">
        <div>
          <label htmlFor="alertKeyword" className="block font-medium">
            Job Keyword:
          </label>
          <input
            type="text"
            id="alertKeyword"
            placeholder="e.g., Software Engineer"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="alertLocation" className="block font-medium">
            Location:
          </label>
          <input
            type="text"
            id="alertLocation"
            placeholder="e.g., Bangalore"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="alertEmail" className="block font-medium">
            Your Email:
          </label>
          <input
            type="email"
            id="alertEmail"
            placeholder="your@example.com"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          id="createAlertButton"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
        >
          Create Alert
        </button>
      </form>
      <div id="alertStatus" className="mt-4 text-center"></div>
    </div>
  );
};

export default JobAlertForm;