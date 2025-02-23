"use client";
import { useState } from "react";
// Example icon imports
import { FaFilter, FaUndoAlt } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const Filters = () => {
  // State for Filters
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [material, setMaterial] = useState("All");

  // State for collapse functionality
  const [isOpen, setIsOpen] = useState(true);

  const handleReset = () => {
    setCategory("All");
    setPriceRange(2000);
    setMaterial("All");
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      {/* Toggle Filters Header */}
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold flex items-center space-x-2 text-gray-900 dark:text-white">
          <FaFilter />
          <span>Filters</span>
        </h3>
        <IoMdArrowDropdown
          className={`text-2xl transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* CATEGORY FILTER */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
            >
              <option>All</option>
              <option>Rings</option>
              <option>Necklaces</option>
              <option>Bracelets</option>
              <option>Earrings</option>
            </select>
          </div>

          {/* PRICE FILTER */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Price Range: <span className="font-semibold">${priceRange}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#d4af37] dark:accent-[#d4af37] transition"
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Slide to filter products by maximum price (0 to 5000).
            </div>
          </div>

          {/* MATERIAL FILTER */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Material
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
            >
              <option>All</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>Diamond</option>
              <option>Platinum</option>
            </select>
          </div>

          {/* RESET FILTERS BUTTON */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            <FaUndoAlt />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
