"use client";
import { useState } from "react";

const Pagination = ({ totalPages, onPageChange }) => {
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);

  // Handle page change
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center space-x-4 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-md disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        Previous
      </button>

      {/* Page Number Indicator */}
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-md disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
