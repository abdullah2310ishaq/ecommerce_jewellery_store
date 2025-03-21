"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({
  totalPages,
  onPageChange,
  currentPageProp = 1, // Add prop to control current page from parent
}: {
  totalPages: number
  onPageChange: (newPage: number) => void
  currentPageProp?: number
}) => {
  const [currentPage, setCurrentPage] = useState(currentPageProp)

  // Update internal state when prop changes
  useEffect(() => {
    setCurrentPage(currentPageProp)
  }, [currentPageProp])

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      onPageChange(newPage)
    }
  }

  // Reset to page 1 when total pages changes
  useEffect(() => {
    // Only reset if current page is out of bounds
    if (currentPage > totalPages) {
      setCurrentPage(1)
      onPageChange(1)
    }
  }, [totalPages, onPageChange, currentPage])

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)

      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 hover:border-[#FB6F90] disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} className="text-gray-700" />
      </button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) =>
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
          ),
        )}
      </div>

      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 hover:border-[#FB6F90] disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={18} className="text-gray-700" />
      </button>
    </div>
  )
}

export default Pagination

