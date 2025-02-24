// "use client";

// import React, { useState } from "react";
// import { FaFilter, FaUndoAlt, FaTag } from "react-icons/fa";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { Switch } from "@headlessui/react";

// interface FiltersProps {
//   filters: {
//     category: string;    // <--- we use "category" now, not "collectionId"
//     priceRange: number;
//     material: string;
//     stone: string;
//     saleOnly: boolean;
//     searchQuery: string;
//   };
//   setFilters: React.Dispatch<React.SetStateAction<{
//     category: string;
//     priceRange: number;
//     material: string;
//     stone: string;
//     saleOnly: boolean;
//     searchQuery: string;
//   }>>;
// }

// export default function Filters({ filters, setFilters }: FiltersProps) {
//   const [isOpen, setIsOpen] = useState(true);

//   const handleReset = () => {
//     setFilters({
//       category: "All",
//       priceRange: 2000,
//       material: "All",
//       stone: "All",
//       saleOnly: false,
//       searchQuery: "",
//     });
//   };

//   return (
//     <div className="bg-black p-6 rounded-lg shadow-md border border-yellow-600">
//       {/* Toggle Filters Header */}
//       <div
//         className="flex items-center justify-between cursor-pointer mb-4"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h3 className="text-xl font-semibold flex items-center space-x-2 text-yellow-400">
//           <FaFilter />
//           <span>Filters</span>
//         </h3>
//         <IoMdArrowDropdown
//           className={`text-2xl text-yellow-400 transition-transform duration-300 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </div>

//       {isOpen && (
//         <div className="space-y-6 text-yellow-100">
//           {/* CATEGORY FILTER */}
//           <div>
//             <label className="block text-yellow-400 mb-2">Category</label>
//             <select
//               value={filters.category}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, category: e.target.value }))
//               }
//               className="w-full p-2 border border-yellow-600 rounded-md bg-black text-yellow-100"
//             >
//               <option>All</option>
//               <option>Rings</option>
//               <option>Necklaces</option>
//               <option>Bracelets</option>
//               <option>Earrings</option>
//               {/* If you have more categories, add them here */}
//             </select>
//           </div>

//           {/* PRICE FILTER */}
//           <div>
//             <label className="block text-yellow-400 mb-2">
//               Price Range: <span className="font-semibold">${filters.priceRange}</span>
//             </label>
//             <input
//               type="range"
//               min="0"
//               max="5000"
//               step="100"
//               value={filters.priceRange}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, priceRange: Number(e.target.value) }))
//               }
//               className="w-full cursor-pointer accent-yellow-500 transition"
//             />
//             <div className="mt-1 text-sm text-yellow-200">
//               Slide to filter products by max price (0 to 5000).
//             </div>
//           </div>

//           {/* MATERIAL FILTER */}
//           <div>
//             <label className="block text-yellow-400 mb-2">Material</label>
//             <select
//               value={filters.material}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, material: e.target.value }))
//               }
//               className="w-full p-2 border border-yellow-600 rounded-md bg-black text-yellow-100"
//             >
//               <option>All</option>
//               <option>Gold</option>
//               <option>Silver</option>
//               <option>Diamond</option>
//               <option>Platinum</option>
//             </select>
//           </div>

//           {/* STONE FILTER */}
//           <div>
//             <label className="block text-yellow-400 mb-2">Gemstone</label>
//             <select
//               value={filters.stone}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, stone: e.target.value }))
//               }
//               className="w-full p-2 border border-yellow-600 rounded-md bg-black text-yellow-100"
//             >
//               <option>All</option>
//               <option>Ruby</option>
//               <option>Sapphire</option>
//               <option>Emerald</option>
//               <option>Amethyst</option>
//             </select>
//           </div>

//           {/* SALE ONLY */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center text-yellow-400 space-x-2">
//               <FaTag />
//               <span>Sale Items Only</span>
//             </label>
//             <Switch
//               checked={filters.saleOnly}
//               onChange={(val) =>
//                 setFilters((prev) => ({ ...prev, saleOnly: val }))
//               }
//               className={`${
//                 filters.saleOnly ? "bg-yellow-500" : "bg-gray-600"
//               } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//             >
//               <span
//                 className={`${
//                   filters.saleOnly ? "translate-x-6" : "translate-x-1"
//                 } inline-block h-4 w-4 transform rounded-full bg-black transition-transform`}
//               />
//             </Switch>
//           </div>

//           {/* SEARCH QUERY */}
//           <div>
//             <label className="block text-yellow-400 mb-2">Search</label>
//             <input
//               type="text"
//               value={filters.searchQuery}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
//               }
//               className="w-full p-2 border border-yellow-600 rounded-md bg-black text-yellow-100"
//               placeholder="Search product name..."
//             />
//           </div>

//           {/* RESET FILTERS BUTTON */}
//           <button
//             onClick={handleReset}
//             className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-500 transition"
//           >
//             <FaUndoAlt />
//             <span>Reset Filters</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
