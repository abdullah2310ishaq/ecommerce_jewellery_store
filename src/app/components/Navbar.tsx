"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext"; // ✅ Import Auth
import { logoutUser } from "@/app/firebase/firebase_services/firebaseAuth"; // ✅ Import logout function

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth(); // ✅ Get user from AuthContext

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-yellow-300 text-sm py-2 px-4 text-center">
        <span className="font-medium tracking-wide">
          Enjoy 10% off your first purchase! Use code: WELCOME10
        </span>
      </div>

      <nav className="bg-gradient-to-r from-black to-gray-900 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LEFT - LOGO */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="H&H Jewelers Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-yellow-100 font-serif tracking-wider">
                    H&H
                  </span>
                  <span className="text-xs text-yellow-300 tracking-widest -mt-1">
                    JEWELRY
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER - SEARCH BAR */}
            <div className="hidden sm:block flex-1 max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search exquisite jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-full bg-gray-800 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* RIGHT - NAV LINKS */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink href="/shop" icon={<ShoppingBag className="w-5 h-5" />}>
                Shop
              </NavLink>
              <NavLink href="/cart" icon={<ShoppingBag className="w-5 h-5" />}>
                Cart
              </NavLink>

              {/* Show Login if no user, Logout if logged in */}
              {user ? (
                <>
                  <span className="text-yellow-100 text-sm">
                    Hi, {user.displayName || "User"}
                  </span>
                  <button
                    onClick={logoutUser}
                    className="text-yellow-100 hover:text-red-400 transition-colors flex items-center space-x-1"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <NavLink href="/login" icon={<User className="w-5 h-5" />}>
                  Login
                </NavLink>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center p-2 rounded-md text-yellow-100 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden bg-gray-900 border-t border-gray-700 overflow-hidden transition-all ease-out duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/shop">Shop</MobileNavLink>
            <MobileNavLink href="/cart">Cart</MobileNavLink>
            
            {/* Show Login if no user, Logout if logged in */}
            {user ? (
              <button
                onClick={logoutUser}
                className="w-full text-left text-yellow-100 hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              <MobileNavLink href="/login">Login</MobileNavLink>
            )}
          </div>

          {/* SEARCH BAR FOR MOBILE */}
          <div className="px-2 py-3">
            <input
              type="text"
              placeholder="Search exquisite jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-800 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </nav>
    </>
  );
};

/** Navigation Links */
const NavLink = ({ href, children, icon }) => (
  <Link
    href={href}
    className="text-yellow-100 hover:text-yellow-300 transition-colors flex items-center space-x-1 group"
  >
    {icon}
    <span className="text-sm font-medium tracking-wide">{children}</span>
  </Link>
);

/** Mobile Navigation Links */
const MobileNavLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-yellow-100 hover:text-yellow-300 block px-3 py-2 rounded-md text-base font-medium transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
