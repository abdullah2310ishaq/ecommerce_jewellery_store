"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ClientToastProvider } from "vyrn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          {/* ✅ Make sure ClientToastProvider wraps everything properly */}
          <ClientToastProvider
            position="top-center"
            swipeDirection="right"
            maxToasts={5}
            layout="normal"
            showCloseButton={true}
            showProgressBar={true}
            color={true}
          >
            {children}
          </ClientToastProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
