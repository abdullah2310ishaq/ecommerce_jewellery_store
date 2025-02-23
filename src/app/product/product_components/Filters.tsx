"use client";
import { useState } from "react";
// React Icons
import { FaFilter, FaUndoAlt, FaTag } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Switch } from "@headlessui/react"; // Optional if you want a nicer toggle

const Filters = () => {
  // State for Filters
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [material, setMaterial] = useState("All");
  const [stone, setStone] = useState("All"); // NEW - Example "Stone" filter
  const [saleOnly, setSaleOnly] = useState(false); // NEW - Sale Items

  // State for collapse functionality
  const [isOpen, setIsOpen] = useState(true);

  const handleReset = () => {
    setCategory("All");
    setPriceRange(2000);
    setMaterial("All");
    setStone("All");
    setSaleOnly(false);
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-md border border-yellow-600">
      {/* Toggle Filters Header */}
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold flex items-center space-x-2 text-yellow-400">
          <FaFilter />
          <span>Filters</span>
        </h3>
        <IoMdArrowDropdown
          className={`text-2xl text-yellow-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="space-y-6 text-yellow-100">
          {/* CATEGORY FILTER */}
          <div>
            <label className="block text-yellow-400 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-yellow-600 rounded-md bg-black text-yellow-100 placeholder:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
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
            <label className="block text-yellow-400 mb-2">
              Price Range: <span className="font-semibold">${priceRange}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full cursor-pointer accent-yellow-500 transition"
            />
            <div className="mt-1 text-sm text-yellow-200">
              Slide to filter products by max price (0 to 5000).
            </div>
          </div>

          {/* MATERIAL FILTER */}
          <div>
            <label className="block text-yellow-400 mb-2">Material</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full p-2 border border-yellow-600 rounded-md bg-black text-yellow-100 placeholder:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
            >
              <option>All</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>Diamond</option>
              <option>Platinum</option>
            </select>
          </div>

          {/* STONE FILTER (NEW) */}
          <div>
            <label className="block text-yellow-400 mb-2">Gemstone</label>
            <select
              value={stone}
              onChange={(e) => setStone(e.target.value)}
              className="w-full p-2 border border-yellow-600 rounded-md bg-black text-yellow-100 placeholder:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
            >
              <option>All</option>
              <option>Ruby</option>
              <option>Sapphire</option>
              <option>Emerald</option>
              <option>Amethyst</option>
            </select>
          </div>

          {/* SALE ONLY (NEW) */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-yellow-400 space-x-2">
              <FaTag className="inline-block" />
              <span>Sale Items Only</span>
            </label>
            {/* Using a Switch from @headlessui/react (optional) */}
            <Switch
              checked={saleOnly}
              onChange={setSaleOnly}
              className={`${
                saleOnly ? "bg-yellow-500" : "bg-gray-600"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span
                className={`${
                  saleOnly ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-black transition-transform`}
              />
            </Switch>
          </div>

          {/* RESET FILTERS BUTTON */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-500 transition"
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
