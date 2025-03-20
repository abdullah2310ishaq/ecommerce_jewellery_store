"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-24 right-6 z-50"
        >
          <div className="bg-gradient-to-br from-[#FB6F90] to-pink-500 rounded-md shadow-lg w-[260px] px-4 py-3 flex flex-col space-y-2">
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              aria-label="Close promotion banner"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Promo Header */}
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-medium uppercase text-white">Sale is Live!</span>
            </div>

            {/* Promo Content */}
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white leading-tight">Rs. 200 OFF</h3>
              <p className="text-white/90 text-sm font-medium">on each item</p>
            
            </div>

            {/* Shop Now Button - Centered */}
            <Link
              href="/product"
              className="w-full text-center py-2 bg-white text-[#FB6F90] text-sm font-medium rounded-md hover:bg-white/90 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
