"use client";
import { useState } from "react";

const Pagination = ({ totalPages, onPageChange }: { totalPages: number; onPageChange: (newPage: number) => void }) => {
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);

  // Handle page change
  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  // Create array of page numbers [1..totalPages]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mt-8 text-gray-900">
      {/* Previous Button */}
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md border border-[#FB6F90] 
          hover:bg-[#FB6F90] hover:text-white transition-colors
          disabled:opacity-50 disabled:pointer-events-none
          bg-white text-[#FB6F90]
        `}
      >
        Previous
      </button>

      {/* Page Number Indicator */}
      <span className="text-lg font-semibold bg-white px-4 py-2 rounded-md border border-[#FB6F90]">
        Page {currentPage} of {totalPages}
      </span>

      {/* Optional: Page Jump Dropdown */}
      {totalPages > 1 && (
        <select
          value={currentPage}
          onChange={(e) => changePage(Number(e.target.value))}
          className="bg-white border border-[#FB6F90] rounded-md px-3 py-2 text-[#FB6F90] focus:outline-none focus:ring-2 focus:ring-[#FB6F90]"
        >
          {pageNumbers.map((num) => (
            <option key={num} value={num} className="text-gray-900">
              Page {num}
            </option>
          ))}
        </select>
      )}

      {/* Next Button */}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md border border-[#FB6F90] 
          hover:bg-[#FB6F90] hover:text-white transition-colors
          disabled:opacity-50 disabled:pointer-events-none
          bg-white text-[#FB6F90]
        `}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
