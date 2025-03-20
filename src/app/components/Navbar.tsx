"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  ShoppingBag,
  User,
  SearchIcon,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { logoutUser } from "@/app/firebase/firebase_services/firebaseAuth";
import SearchWithModal from "./Search";

// Desktop Navigation Link with underline animation
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      href={href}
      className="relative py-2 px-3 text-gray-700 font-medium text-sm tracking-wide group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-[#FB6F90] w-0 group-hover:w-full transition-all duration-300"
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  );
};

// Mobile Navigation Link with beautiful styling
const MobileNavLink = ({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center space-x-4 p-4 w-full text-gray-700 hover:bg-[#FB6F90]/10 hover:text-[#FB6F90] rounded-lg transition-all duration-300 ease-in-out"
      onClick={onClick}
    >
      <div className="text-[#FB6F90]/70">{icon}</div>
      <span className="text-lg font-medium">{children}</span>
    </Link>
  );
};

export default function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  // Sample collections array – adjust as needed
  const collections = [
    { name: "Necklaces", slug: "necklaces" },
    { name: "Rings", slug: "rings" },
    { name: "Bracelets", slug: "bracelets" },
    { name: "Earrings", slug: "earrings" },
  ];

  // Close mobile menu when navigating
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCollectionsOpen(false);
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle search modal
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Toggle collections submenu in mobile menu
  const toggleCollections = () => {
    setIsCollectionsOpen(!isCollectionsOpen);
  };

  return (
    <>
      {/* Elegant announcement bar with subtle animation */}
      <div className="bg-gradient-to-r from-[#FB6F90]/5 via-[#FB6F90]/15 to-[#FB6F90]/5 text-[#FB6F90] text-sm py-3 text-center tracking-wide font-medium">
        <span className="inline-block animate-pulse">✨</span> Exclusive 10% off on your first order! Use code: <span className="font-bold">WELCOME10</span> <span className="inline-block animate-pulse">✨</span>
      </div>

      {/* Navbar with refined scroll effect */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-white border-b border-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center h-20">
          {/* Logo with refined animation */}
          <Link href="/home" className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden rounded-full">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src="/logo.png"
                  alt="H&H Jewelers Logo"
                  width={45}
                  height={45}
                  className="object-contain"
                />
              </motion.div>
            </div>
            <div className="flex flex-col">
              <span className="text-[#FB6F90] text-2xl font-bold tracking-wide group-hover:text-[#FB6F90]/80 transition-colors">
                H&H Jewellery
              </span>
              <span className="text-gray-500 text-xs tracking-widest">
                FINE JEWELRY COLLECTION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered and elegant */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink href="/home">Home Page</NavLink>
            <NavLink href="/product">All Products</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/cart">Cart</NavLink>
          </div>

          {/* Desktop Icons - Refined with subtle hover effects */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Integrated Search Button */}
            <div className="relative">
              <button
                onClick={toggleSearch}
                className="text-gray-600 hover:text-[#FB6F90] transition-colors p-2 rounded-full hover:bg-[#FB6F90]/10"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Search modal */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
                  >
                    <div className="p-4">
                      <SearchWithModal />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/cart"
              className="text-gray-600 hover:text-[#FB6F90] transition-colors p-2 rounded-full hover:bg-[#FB6F90]/10 group relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Cart
              </span>
            </Link>

            {/* User Account with refined dropdown */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-[#FB6F90] p-2 rounded-full hover:bg-[#FB6F90]/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FB6F90]/20 to-[#FB6F90]/30 flex items-center justify-center text-[#FB6F90] font-medium">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                </button>

                {/* User dropdown with refined styling */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                  <div className="p-3 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-700">
                      Hi, {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/cart"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FB6F90]/10 hover:text-[#FB6F90] rounded-md"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={logoutUser}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FB6F90]/10 hover:text-[#FB6F90] rounded-md"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center space-x-2 text-gray-600 hover:text-white transition-all py-1.5 px-4 rounded-full border border-gray-200 hover:border-[#FB6F90] hover:bg-[#FB6F90]"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu & Search Buttons - Refined */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={toggleSearch}
              className="text-gray-600 hover:text-[#FB6F90] transition p-2"
              aria-label="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            <Link
              href="/cart"
              className="text-gray-600 hover:text-[#FB6F90] transition p-2"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-700 hover:text-[#FB6F90] transition p-2"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen Search Modal for Mobile */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 lg:hidden"
          >
            <div className="pt-20 px-4 pb-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Search Products
                </h2>
                <button
                  onClick={toggleSearch}
                  className="text-gray-500 hover:text-[#FB6F90] p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1">
                <SearchWithModal />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redesigned Mobile Menu - Elegant side drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closeMenu}
            />

            {/* Side drawer with refined animation */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-xl overflow-y-auto"
            >
              {/* Header with subtle gradient */}
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-[#FB6F90]/5 to-white">
                <div className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={35}
                    height={35}
                    className="object-contain mr-3"
                  />
                  <span className="text-[#FB6F90] font-bold">H&H Jewelers</span>
                </div>
                <button
                  onClick={closeMenu}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User section with refined styling */}
              <div className="p-6 border-b border-gray-50">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FB6F90]/20 to-[#FB6F90]/30 flex items-center justify-center text-[#FB6F90] text-xl font-medium">
                      {user.displayName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FB6F90] to-[#FB6F90]/90 text-white py-3 px-4 rounded-lg w-full hover:opacity-95 transition-opacity"
                    onClick={closeMenu}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Sign In / Register</span>
                  </Link>
                )}
              </div>

              {/* Navigation links with refined spacing */}
              <div className="p-4">
                <MobileNavLink
                  href="/product"
                  icon={<ShoppingBag className="w-5 h-5" />}
                  onClick={closeMenu}
                >
                  Products
                </MobileNavLink>
                <MobileNavLink
                  href="/cart"
                  icon={<ShoppingBag className="w-5 h-5" />}
                  onClick={closeMenu}
                >
                  Shopping Cart
                </MobileNavLink>
                {/* New Collections Button */}
                <div className="flex flex-col">
                  <button
                    onClick={toggleCollections}
                    className="flex items-center space-x-4 p-4 w-full text-gray-700 hover:bg-[#FB6F90]/10 hover:text-[#FB6F90] rounded-lg transition-all duration-300 ease-in-out"
                  >
                    <div className="text-[#FB6F90]/70">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-medium">Collections</span>
                  </button>
                  {/* Collections submenu */}
                  <AnimatePresence>
                    {isCollectionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-8 overflow-hidden"
                      >
                        {collections.map((col) => (
                          <Link
                            key={col.slug}
                            href="/product"
                            className="block py-3 pl-4 pr-2 text-gray-600 hover:bg-[#FB6F90]/10 hover:text-[#FB6F90] rounded-lg transition-colors"
                            onClick={closeMenu}
                          >
                            {col.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <MobileNavLink
                  href="/about"
                  icon={<User className="w-5 h-5" />}
                  onClick={closeMenu}
                >
                  About Us
                </MobileNavLink>
              </div>

              {/* Footer with subtle styling */}
              {user && (
                <div className="mt-auto p-6 border-t border-gray-50 bg-gray-50/50">
                  <button
                    onClick={() => {
                      logoutUser();
                      closeMenu();
                    }}
                    className="flex items-center justify-center space-x-2 text-gray-700 py-3 w-full border border-gray-200 rounded-lg hover:bg-white transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
