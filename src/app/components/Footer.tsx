"use client";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#faf6f2] dark:bg-[#1c1c1c] text-[#3d3d3d] dark:text-[#f0e6d2] py-10 px-6 md:px-16 lg:px-32">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Left Section - Logo & About */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Jewelry Store Logo" width={50} height={50} />
            <h1 className="text-2xl font-semibold tracking-wide">Jewelry Luxe</h1>
          </Link>
          <p className="mt-4 text-sm text-center md:text-left max-w-sm">
            Elevate your elegance with our finest collection of handcrafted jewelry. Timeless beauty, exceptional quality.
          </p>
        </div>

        {/* Center Section - Quick Links */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <Link href="/" className="hover:text-[#b98d56] dark:hover:text-[#d4af37] transition">Home</Link>
          <Link href="/shop" className="hover:text-[#b98d56] dark:hover:text-[#d4af37] transition">Shop</Link>
          <Link href="/about" className="hover:text-[#b98d56] dark:hover:text-[#d4af37] transition">About Us</Link>
          <Link href="/contact" className="hover:text-[#b98d56] dark:hover:text-[#d4af37] transition">Contact</Link>
        </div>

        {/* Right Section - Contact Info */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <p className="text-sm">📞 <a href="tel:03445751822" className="hover:text-[#b98d56] dark:hover:text-[#d4af37] transition">0344-5751822</a></p>
          <p className="text-sm">📧 <a href="mailto:handhjewelry925@gmail.com" className="hover:text-[#b98d56] dark:hover:text-[#d4af37] transition">handhjewelry925@gmail.com</a></p>
          <div className="flex space-x-4 mt-2">
            <a href="https://www.instagram.com/handh_jewelry?igsh=ejY4YjI3cTllYXlw" target="_blank">
              <Image src="/instagram.png" alt="Instagram" width={24} height={24} className="hover:opacity-80 transition" />
            </a>
            <a href="https://www.facebook.com/share/1FAxWUrtwR/?mibextid=wwXIfr" target="_blank">
              <Image src="/facebook.png" alt="Facebook" width={24} height={24} className="hover:opacity-80 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 text-center text-sm border-t border-[#e0dcd7] dark:border-[#2a2a2a] pt-4">
        © {new Date().getFullYear()} Jewelry Luxe. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
