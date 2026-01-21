import React from "react";
import { getCompanyReviews } from "@/services/reviewsService"; // Ensure the path is correct

const CompanyReviews: React.FC = () => {
  const handleGetReviews = () => {
    const companyInput = document.getElementById("companyReviewInput") as HTMLInputElement;
    if (companyInput) {
      const companyName = companyInput.value.trim();
      getCompanyReviews(companyName); // Call the function with the company name
    }
  };
  return (
    <div className="company-review-section bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-primary mb-4">Company Reviews</h2>
      <label htmlFor="companyReviewInput" className="block font-medium">
        Enter Company Name:
      </label>
      <input
        type="text"
        id="companyReviewInput"
        placeholder="e.g., Amazon"
        className="w-full p-2 border border-gray-300 rounded-md mt-2"
      />
      <button
        type="button"
        id="getReviewsButton"
        className="w-full bg-primary text-white py-2 mt-4 rounded-md hover:bg-primary-dark transition"
        onClick={handleGetReviews} // Add the onClick handler
      >
        Get Company Reviews
      </button>
    </div>
  );
};

export default CompanyReviews;