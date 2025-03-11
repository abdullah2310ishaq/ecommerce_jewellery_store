"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({ totalPages, onPageChange }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Stable page change handler
  const changePage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        onPageChange(newPage);
      }
    },
    [totalPages, onPageChange]
  );

  // Reset to page 1 if totalPages changes
  useEffect(() => {
    setCurrentPage(1);
    onPageChange(1);
  }, [totalPages, onPageChange]);

  // Memoize the page numbers calculation
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 hover:border-[#FB6F90] disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} className="text-gray-700" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => changePage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                currentPage === page
                  ? "bg-[#FB6F90] text-white font-medium"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-[#FB6F90]"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-1">
              {page}
            </span>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 hover:border-[#FB6F90] disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={18} className="text-gray-700" />
      </button>
    </div>
  );
};

export default memo(Pagination);
