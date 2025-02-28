"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import {
  googleSignIn,
  loginUser,
  registerUser,
} from "@/app/firebase/firebase_services/firebaseAuth";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  // Handle Google authentication
  const handleGoogleAuth = async () => {
    try {
      console.log("[DEBUG] Initiating Google sign-in process...");
      setLoading(true);
      setError("");
      const user = await googleSignIn();
      console.log(`[DEBUG] Google sign-in success: ${user.email}`);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed in successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      router.push("/home");
    } catch (err) {
      console.error("[DEBUG] Google auth failed:", err);
      setError(
        `Failed to ${isLogin ? "sign in" : "sign up"} with Google. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle email/password form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      let user;
      if (isLogin) {
        user = await loginUser(email, password);
      } else {
        user = await registerUser(email, password, displayName);
      }
      console.log(`[DEBUG] ${isLogin ? "Signed in" : "Signed up"} as:`, user.email);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${isLogin ? "Signed in" : "Signed up"} successfully!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      router.push("/home");
    } catch (err) {
      console.error("[DEBUG] Email/Password auth error:", err);
      setError(`Failed to ${isLogin ? "sign in" : "sign up"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="text-center"
            >
              <motion.img
                src="/logo.png"
                alt="Brand Logo"
                className="mx-auto mb-8 w-48 h-48 object-contain"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.h2
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {isLogin ? "Welcome Back!" : "Join Our Family"}
              </motion.h2>
              <motion.p
                className="text-gray-300 text-lg mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {isLogin
                  ? "Sign in to continue your journey"
                  : "Sign up to start your new adventure"}
              </motion.p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="displayName" className="block text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg"
                    required
                  />
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 text-black py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
              </motion.button>
            </form>

            <div className="flex items-center justify-center my-4">
              <span className="text-gray-400">or</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white text-gray-800 py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <FcGoogle className="w-6 h-6" />
              <span className="text-lg">
                {loading ? "Processing..." : isLogin ? "Sign In with Google" : "Sign Up with Google"}
              </span>
            </motion.button>

            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-400 hover:text-yellow-300 transition duration-300 text-lg"
              >
                {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="px-8 pb-8 pt-0 sm:px-12 sm:pb-12 text-center"
          >
            {/* Optionally add Terms and Privacy text here */}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
