"use client";
import { useState } from "react";

const Filters = () => {
  // State for Filters
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [material, setMaterial] = useState("All");

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      {/* Filters Heading */}
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Filters</h3>

      {/* CATEGORY FILTER */}
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        >
          <option>All</option>
          <option>Rings</option>
          <option>Necklaces</option>
          <option>Bracelets</option>
          <option>Earrings</option>
        </select>
      </div>

      {/* PRICE FILTER */}
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Price Range: ${priceRange}</label>
        <input 
          type="range" 
          min="0" 
          max="5000" 
          step="100" 
          value={priceRange} 
          onChange={(e) => setPriceRange(Number(e.target.value))} 
          className="w-full"
        />
      </div>

      {/* MATERIAL FILTER */}
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Material</label>
        <select 
          value={material} 
          onChange={(e) => setMaterial(e.target.value)} 
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
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
        onClick={() => { setCategory("All"); setPriceRange(2000); setMaterial("All"); }} 
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
