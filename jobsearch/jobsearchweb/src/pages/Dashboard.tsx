import React, { useState } from "react";
import CompanyReviews from "../components/CompanyReviews";
import JobAlertForm from "../components/JobAlertForm";
// import Filters from "../components/Filters";
import ResumeUpload from "../components/ResumeUpload";
import JobResults from "../components/JobResults";
import { FaBuilding } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [showCompanyReviews, setShowCompanyReviews] = useState(false);

  const toggleCompanyReviews = () => {
    setShowCompanyReviews(!showCompanyReviews);
  };

  return (
    <div className="main-container flex flex-col lg:flex-row gap-8 p-6 bg-gray-100 min-h-screen">
      {/* Left Column */}
      <div className="left-column flex-1 space-y-6">
        {showCompanyReviews && <CompanyReviews />}
        <JobAlertForm />
        
      </div>

      {/* Right Column */}
      <div className="right-column flex-1 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={toggleCompanyReviews}
            className="bg-primary text-white p-3 rounded-full shadow-md hover:bg-primary-dark transition"
            title="Toggle Company Reviews"
          >
            <FaBuilding size={24} />
          </button>
        </div>
        <ResumeUpload />
        <JobResults />
      </div>
    </div>
  );
};

export default Dashboard;