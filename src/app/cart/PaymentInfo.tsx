"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PaymentInfo({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
      >
        {/* Bank Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/logoo.jpg" alt="UBL Bank Logo" width={120} height={50} />
        </div>

        {/* Payment Title */}
        <h2 className="text-2xl font-bold text-center text-[#FB6F90] mb-3">
          Payment Information
        </h2>

        {/* Online Payment Details */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-lg font-semibold text-gray-700 mb-1">Bank Transfer Details:</p>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>🏦 <strong>Bank:</strong> UBL (United Bank Limited)</li>
            <li>🔢 <strong>Account No:</strong> 0234325471042</li>
            <li>👤 <strong>Account Holders:</strong> Muhammad Humza & Muhammad Huzaifa</li>
          </ul>
        </div>

      {/* Discount Offer */}
        <div className="bg-[#FB6F90] text-white p-3 rounded-lg text-center mb-4">
          <p className="text-sm font-medium">
            🎉 Get a <strong>discount</strong> on online payment! 
            Send a screenshot of the transaction with your order name on WhatsApp.
          </p>
        </div>

        {/* WhatsApp Contact */}
        <p className="text-gray-700 text-center mb-4">
          📩 Send payment proof with order_id to WhatsApp:  
          <a href="https://wa.me/923345751822" target="_blank" className="text-[#FB6F90] font-semibold">
            +92 334 5751822
          </a>
        </p>

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white font-bold py-2 px-5 rounded-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
