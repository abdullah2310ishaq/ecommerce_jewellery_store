"use client";

import React, { useState } from "react";
import {
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlinePhone,
  AiOutlineLock,
  AiFillGoogleCircle,
} from "react-icons/ai";
import { motion } from "framer-motion"; 

// Import your Firebase Auth methods
import { registerUser, loginUser, googleSignIn } from "@/app/firebase/firebase_services/firebaseAuth";

// ---------- Validation Helpers ----------
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  // Min 8 chars, at least one special char
  const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passRegex.test(password);
};

const validatePhoneNumber = (phone: string) => {
  // Basic worldwide phone number check
  // e.g. +1 555 555 5555 or 555-555-5555
  const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/;
  return !phone || phoneRegex.test(phone); // phone optional => pass if empty
};

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
  });

  // -------------- Form Submit --------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic checks
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Additional checks for Sign Up
    if (!isLogin) {
      // name
      if (!formData.name) {
        setError("Name is required for sign up.");
        setLoading(false);
        return;
      }
      // phone
      if (!validatePhoneNumber(formData.phoneNumber)) {
        setError("Please provide a valid phone number format.");
        setLoading(false);
        return;
      }
      // confirm password
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters with at least one special character."
      );
      setLoading(false);
      return;
    }

    // -------------- Actual Firebase Auth Call --------------
    try {
      if (isLogin) {
        // Login
        const user = await loginUser(formData.email, formData.password);
        alert(`Welcome back, ${user?.displayName || user?.email}!`);
      } else {
        // Register
        const user = await registerUser(formData.email, formData.password, formData.name);
        alert(`Account created! Welcome, ${user?.displayName || user?.email}.`);
      }
      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phoneNumber: "",
      });
      setRememberMe(false);
    } catch (err: unknown) {
      console.error("Auth error:", err);
      if (err instanceof Error) {
        setError(err.message || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------- Google Sign-In --------------
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await googleSignIn();
      alert(`Signed in with Google as: ${user.email}`);
    } catch (err: unknown) {
      console.error("Google sign-in error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  // -------------- Input Change --------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-gray-900 p-6 text-gray-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-lg overflow-hidden shadow-2xl bg-gray-800">
        {/* Left side - Illustration with Logo */}
        <div className="hidden md:flex md:w-1/2 p-12 items-center justify-center relative bg-black">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="Brand Logo"
              className="mx-auto mb-8 w-32 h-32 object-contain"
            />
            <h2 className="text-3xl font-bold text-gray-100 mb-4">
              {isLogin ? "Welcome Back!" : "Join Our Family"}
            </h2>
            <p className="text-gray-400 text-lg">
              {isLogin
                ? "Sign in to continue your journey"
                : "Sign up to start your new adventure"}
            </p>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-yellow-400 text-sm">Powered by SecureAuth</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 bg-gray-800 p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">
                {isLogin ? "Need an account?" : "Have an account?"}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-yellow-400 hover:text-yellow-300"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name for Sign Up */}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="name" className="text-gray-200">
                  Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-gray-200">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Phone for Sign Up */}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="phoneNumber" className="text-gray-200">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <AiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-gray-200">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password for Sign Up */}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-gray-200">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}

            {/* Remember Me (for sign in) */}
            {isLogin && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-gray-700 border-gray-600"
                />
                <label htmlFor="rememberMe" className="text-gray-200 text-sm">
                  Remember Me
                </label>
              </div>
            )}

            {/* Show any Error */}
            {error && (
              <div className="bg-red-800 border border-red-700 text-white p-3 rounded-md mt-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-md font-medium transition-colors mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.span
                    className="mr-2 inline-block h-5 w-5 border-2 border-t-transparent border-yellow-200 rounded-full animate-spin"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center w-full border border-gray-600 text-sm py-3 mt-2 rounded-md hover:bg-yellow-600/10 transition-colors text-gray-200"
            >
              <AiFillGoogleCircle className="mr-2 h-5 w-5" />
              {isLogin ? "Sign In with Google" : "Sign Up with Google"}
            </button>

            {/* Forgot Password Link (Login Only) */}
            {isLogin && (
              <div className="text-center mt-3">
                <a
                  href="#"
                  className="text-sm text-yellow-400 hover:text-yellow-300"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}
