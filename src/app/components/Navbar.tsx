"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 lg:px-20 py-4 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b border-gray-700">
      {/* LEFT - LOGO */}
     
<Link href="/" className="flex items-center space-x-2">
  <Image 
    src="/logo.png" 
    alt="H&H Jewelers Logo" 
    width={50} 
    height={50} 
    className="w-14 h-14 object-contain"
  />
  <div className="flex flex-col">
    <span className="text-2xl font-semibold text-yellow-100 font-serif tracking-wider">H&H</span>
    <span className="text-sm text-yellow-300 tracking-widest -mt-1">JEWELRY</span>
  </div>
</Link>


      {/* CENTER - SEARCH BAR */}
      <div className="relative w-1/3 md:w-1/2">
        <input
          type="text"
          placeholder="Search jewelry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-full bg-gray-800 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {/* RIGHT - NAV LINKS */}
      <div className="flex items-center space-x-8">
        <Link 
          href="/shop" 
          className="text-yellow-100 hover:text-yellow-300 transition-colors flex items-center space-x-1 group"
        >
          <span className="text-sm font-medium tracking-wide">Shop</span>
        </Link>
        
        <Link 
          href="/cart" 
          className="text-yellow-100 hover:text-yellow-300 transition-colors flex items-center space-x-1 group"
        >
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium tracking-wide">Cart</span>
        </Link>
        
        <Link 
          href="/login" 
          className="text-yellow-100 hover:text-yellow-300 transition-colors flex items-center space-x-1 group"
        >
          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium tracking-wide">Login</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;