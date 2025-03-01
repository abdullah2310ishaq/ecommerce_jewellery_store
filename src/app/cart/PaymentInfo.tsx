"use client";

import { motion } from "framer-motion";

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
        className="bg-white rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#FB6F90]">Payment Information</h2>
        <p className="mb-4">
          For demonstration purposes, use the following dummy payment information:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Card Number: 4111 1111 1111 1111</li>
          <li>Expiry Date: Any future date</li>
          <li>CVV: Any 3-digit number</li>
          <li>Name on Card: Any name</li>
        </ul>
        <p className="mb-4">For Cash on Delivery, no additional information is required.</p>
        <button
          onClick={onClose}
          className="bg-[#FB6F90] hover:bg-[#FB6F90]/90 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
