"use client";

import React from "react";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
 
  ArrowUp
} from "lucide-react";

const Footer = () => {
  // "Scroll to Top" logic is now valid in a client component.
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />

      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-serif text-yellow-400">H&H</h2>
                <span className="text-sm tracking-widest text-yellow-500">
                  JEWELLERY
                </span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Elevate your elegance with our finest collection of handcrafted
              jewelry. Where timeless beauty meets exceptional quality.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/handh_jewelry?igsh=ejY4YjI3cTllYXlw"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1FAxWUrtwR/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-12">
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {["Home", "Shop", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center group text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:03445751822"
                  className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <Phone className="w-5 h-5" />
                  <span>0344-5751822</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:handhjewelry925@gmail.com"
                  className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>handhjewelry925@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates about new collections and special
              offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400 transition-colors duration-300"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Example "Trusted" Section (Optional) */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 bg-black/30 py-6 px-4 rounded-lg border border-yellow-700">
          <div className="text-center">
            <h4 className="text-yellow-400 text-xl font-semibold mb-2">
              Trusted by Thousands
            </h4>
            <p className="text-sm text-gray-400 max-w-sm">
              We pride ourselves on exceptional craftsmanship and attentive
              service. Join our growing family of satisfied customers.
            </p>
          </div>
          {/* Icons row */}
          {/* ... */}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} H&H Jewellery. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <Link
              href="/privacy"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              Terms of Service
            </Link>
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center text-gray-500 hover:text-yellow-400 transition-colors duration-300"
            >
              <ArrowUp className="w-5 h-5 mr-1" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
