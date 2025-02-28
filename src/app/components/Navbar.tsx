"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import SearchWithModal from "./Search";

// Desktop link component
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-gray-300 hover:text-yellow-400 transition font-medium text-sm tracking-wide">
    {children}
  </Link>
);

// Desktop icon link component
const NavIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-gray-400 hover:text-yellow-400 transition flex items-center">
    {children}
  </Link>
);

// Mobile link component - Closes menu on click
const MobileNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) => (
  <Link href={href} onClick={onClick} className="text-2xl font-medium hover:text-yellow-500 transition">
    {children}
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 text-yellow-300 text-sm py-3 text-center tracking-wide font-medium">
        ✨ Exclusive 10% off on your first order! Use code: <span className="font-bold">WELCOME10</span> ✨
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            <span className="text-yellow-300 text-2xl font-bold tracking-wide">H&H Jewelers</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden sm:block flex-1 max-w-lg mx-8">
            <SearchWithModal />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <NavLink href="/shop">Collections</NavLink>
            <NavLink href="/product">Products</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavIcon href="/cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="ml-2 text-sm">Cart</span>
            </NavIcon>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="px-3 py-1 bg-gray-700 rounded-full">
                  <span className="text-yellow-300 text-sm">Hi, {user.displayName || user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full bg-gray-700 hover:bg-yellow-600 transition"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            ) : (
              <NavIcon href="/auth">
                <User className="w-5 h-5" />
              </NavIcon>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-yellow-300 hover:text-yellow-500 transition"
            aria-label="Open mobile menu"
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
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-yellow-300 space-y-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-yellow-400 transition"
              aria-label="Close mobile menu"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Mobile Navigation Links - Closes Menu on Click */}
            <MobileNavLink href="/shop" onClick={() => setIsMenuOpen(false)}>Collections</MobileNavLink>
            <MobileNavLink href="/product" onClick={() => setIsMenuOpen(false)}>Products</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/cart" onClick={() => setIsMenuOpen(false)}>Cart</MobileNavLink>

            {/* Mobile User Authentication */}
            {user ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="px-3 py-1 bg-gray-700 rounded-full">
                  <span className="text-yellow-400 text-lg font-medium">Hi, {user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-700 text-yellow-400 rounded hover:bg-yellow-600 transition text-lg font-medium"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <MobileNavLink href="/auth" onClick={() => setIsMenuOpen(false)}>Login</MobileNavLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
