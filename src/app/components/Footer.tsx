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
    <footer className="relative bg-white text-gray-900">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FB6F90] via-[#FB6F90] to-[#FB6F90]" />

      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/home" className="block">
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-serif text-[#FB6F90]">H&H</h2>
                <span className="text-sm tracking-widest text-[#FB6F90]">
                  JEWELLERY
                </span>
              </div>
            </Link>
            <p className="text-gray-700 leading-relaxed">
              Elevate your elegance with our finest collection of handcrafted
              jewelry. Where timeless beauty meets exceptional quality.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/handh_jewelry?igsh=ejY4YjI3cTllYXlw"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="p-2 bg-gray-200 rounded-lg hover:bg-[#FB6F90] transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1FAxWUrtwR/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="p-2 bg-gray-200 rounded-lg hover:bg-[#FB6F90] transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-12">
            <h3 className="text-lg font-semibold mb-6 text-[#FB6F90]">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {["Home", "About"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center group text-gray-700 hover:text-[#FB6F90] transition-colors duration-300"
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
            <h3 className="text-lg font-semibold mb-6 text-[#FB6F90]">
              Contact Us
            </h3>
            <ul className="space-y-4">
            <li>
  <a
    href="https://wa.me/923445751822"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-3 text-gray-700 hover:text-[#FB6F90] transition-colors duration-300"
  >
    <Phone className="w-5 h-5" />
    <span>WhatsApp: 0344-5751822</span>
  </a>
</li>

              <li>
                <a
                  href="mailto:handhjewelry925@gmail.com"
                  className="flex items-center space-x-3 text-gray-700 hover:text-[#FB6F90] transition-colors duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>handhjewelry925@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-700">
                <MapPin className="w-5 h-5" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} H&H Jewellery. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
        
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center text-gray-600 hover:text-[#FB6F90] transition-colors duration-300"
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
