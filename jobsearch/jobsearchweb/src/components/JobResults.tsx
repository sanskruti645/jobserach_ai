import React from "react";

const JobResults: React.FC = () => {
  return (
    <div className="container bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-primary mb-4">Job Results</h3>
      <div id="careerjet-listings" className="mt-4"></div>
      <div id="naukriTable" className="mt-4"></div>
      <div id="linkedinTable" className="mt-4"></div>
    </div>
  );
};

export default JobResults;