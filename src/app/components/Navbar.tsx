"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { logoutUser } from "@/app/firebase/firebase_services/firebaseAuth";
import SearchWithModal from "./Search";

// Desktop link
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-gray-600 hover:text-[#FB6F90] transition font-medium text-sm tracking-wide"
  >
    {children}
  </Link>
);

// Desktop icon link
const NavIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-gray-600 hover:text-[#FB6F90] transition flex items-center"
  >
    {children}
  </Link>
);

// Mobile link
const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-2xl font-medium hover:text-[#FB6F90] transition"
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#FB6F90]/20 text-[#FB6F90] text-sm py-3 text-center tracking-wide font-medium">
        ✨ Exclusive 10% off on your first order! Use code: <span className="font-bold">WELCOME10</span> ✨
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-[#FB6F90] text-2xl font-bold tracking-wide">
              H&H Jewelers
            </span>
          </Link>

          {/* Desktop Search (Centered) */}
          <div className="hidden sm:flex flex-1 justify-center max-w-lg">
            <SearchWithModal />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <NavLink href="/shop">Collections</NavLink>
            <NavLink href="/product">Products</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavIcon href="/cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="ml-2 text-sm">Cart</span>
            </NavIcon>

            {user ? (
              <>
                <span className="text-[#FB6F90] text-sm">Hi, {user.displayName || "User"}</span>
                <button
                  onClick={logoutUser}
                  className="text-gray-600 hover:text-[#FB6F90] transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <NavIcon href="/auth">
                <User className="w-5 h-5" />
              </NavIcon>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-[#FB6F90] hover:text-[#fb4e73] transition"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-[#FB6F90] space-y-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-gray-600 hover:text-[#FB6F90] transition"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Mobile Navigation Links */}
            <MobileNavLink href="/shop">Collections</MobileNavLink>
            <MobileNavLink href="/product">Products</MobileNavLink>
            <MobileNavLink href="/about">About</MobileNavLink>
            <MobileNavLink href="/contact">Contact</MobileNavLink>
            <MobileNavLink href="/cart">Cart</MobileNavLink>

            {/* User Authentication */}
            {user ? (
              <button
                onClick={logoutUser}
                className="text-[#FB6F90] hover:text-[#fb4e73] transition text-lg font-medium"
              >
                Logout
              </button>
            ) : (
              <MobileNavLink href="/auth">Login</MobileNavLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
