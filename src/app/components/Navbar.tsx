"use client";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 lg:px-20 py-4 bg-[#1e1e1e] dark:bg-[#121212] shadow-md border-b border-[#2a2a2a] transition-all">
  
      <Link href="/" className="text-2xl font-semibold text-[#e0e0e0] dark:text-[#f0e6d2] tracking-wide">
      H&H Jewelry
      </Link>

      {/* CENTER - SEARCH BAR */}
      <div className="relative w-1/3 md:w-1/2">
        <input
          type="text"
          placeholder="Search jewelry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] dark:bg-[#1c1c1c] text-[#e0e0e0] dark:text-[#f0e6d2] border border-[#3a3a3a] dark:border-[#2e2e2e] focus:ring-2 focus:ring-[#d4af37] outline-none transition"
        />
      </div>

      {/* RIGHT - NAV LINKS */}
      <div className="flex space-x-6 text-[#cfcfcf] dark:text-[#b8b8b8] text-lg font-medium">
        <Link href="/shop" className="hover:text-[#d4af37] transition">Shop</Link>
        <Link href="/cart" className="hover:text-[#d4af37] transition">Cart</Link>
        <Link href="/login" className="hover:text-[#d4af37] transition">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
