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
  const { user } = useAuth(); 

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-yellow-300 text-sm py-3 px-4 text-center font-bold">
        <span className="inline-block border-b-2 border-yellow-300 px-6 py-1">
          ✦ Enjoy 10% off your first purchase! Use code: WELCOME10 ✦
        </span>
      </div>

      <nav className="bg-gradient-to-r from-black to-gray-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* LEFT - LOGO */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-300 rounded-full blur opacity-30"></div>
                  <div className="relative">
                    <Image
                      src="/logo.png"
                      alt="H&H Jewelers Logo"
                      width={46}
                      height={46}
                      className="w-12 h-12 object-contain p-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col ml-3 border-l-2 border-yellow-600 pl-3">
                  <span className="text-2xl font-bold text-yellow-100 font-serif tracking-wider">
                    H&H
                  </span>
                  <span className="text-xs text-yellow-300 tracking-widest -mt-1 uppercase">
                    Fine Jewelry
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER - SEARCH BAR */}
            <div className="hidden sm:block flex-1 max-w-lg mx-8">
              <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-inner">
                <input
                  type="text"
                  placeholder="Search exquisite jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-transparent text-gray-100 focus:ring-1 focus:ring-yellow-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                />
                <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Search className="text-yellow-500 w-5 h-5" />
                </div>
              </div>
            </div>

            {/* RIGHT - NAV LINKS */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/shop" icon={<ShoppingBag className="w-4 h-4" />}>
                Shop
              </NavLink>
              <NavLink href="/cart" icon={<ShoppingBag className="w-4 h-4" />}>
                Cart
              </NavLink>

              {/* Show Login if no user, Logout if logged in */}
              {user ? (
                <>
                  <div className="px-4 py-1 mx-3 rounded-full bg-gray-800 border border-gray-700">
                    <span className="text-yellow-100 text-sm">
                      Hi, {user.displayName || "User"}
                    </span>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-full text-yellow-100 hover:text-yellow-300 transition-all flex items-center space-x-2 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <NavLink href="/auth" icon={<User className="w-4 h-4" />}>
                  Login
                </NavLink>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center p-2 rounded-full bg-gray-800 border border-gray-700 text-yellow-300 hover:text-yellow-100 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden bg-gray-900 border-t border-gray-800 overflow-hidden transition-all ease-out duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-4 pb-5 space-y-3">
            <MobileNavLink href="/shop">Shop</MobileNavLink>
            <MobileNavLink href="/cart">Cart</MobileNavLink>
            
            {/* Show Login if no user, Logout if logged in */}
            {user ? (
              <button
                onClick={logoutUser}
                className="w-full text-left text-yellow-100 hover:text-yellow-300 flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800 text-base font-medium transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <MobileNavLink href="/login">Login</MobileNavLink>
            )}
          </div>

          {/* SEARCH BAR FOR MOBILE */}
          <div className="px-4 py-4 border-t border-gray-800">
            <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
              <input
                type="text"
                placeholder="Search exquisite jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-transparent text-gray-100 focus:ring-1 focus:ring-yellow-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
              />
              <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Search className="text-yellow-500 w-5 h-5" />
              </div>
            </div>
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
    className="text-yellow-100 hover:text-yellow-300 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all flex items-center space-x-2 mx-1 group"
  >
    <div className="group-hover:rotate-12 transition-transform">
      {icon}
    </div>
    <span className="text-sm font-medium tracking-wide">{children}</span>
  </Link>
);

/** Mobile Navigation Links */
const MobileNavLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-yellow-100 hover:text-yellow-300 block px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-base font-medium transition-all flex items-center space-x-3"
  >
    <ShoppingBag className="w-5 h-5" />
    <span>{children}</span>
  </Link>
);

export default Navbar;