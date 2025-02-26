"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { googleSignIn } from "@/app/firebase/firebase_services/firebaseAuth";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import {useRouter} from "next/navigation";
export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [particlesLoaded, setParticlesLoaded] = useState(false);
const router = useRouter();
  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError("");
      const user = await googleSignIn();
      console.log(`${isLogin ? "Signed in" : "Signed up"} with Google as:`, user.email);
      router.push("/home");
    } catch (err) {
      console.error("Google auth error:", err);
      setError(`Failed to ${isLogin ? "sign in" : "sign up"} with Google. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setParticlesLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6 overflow-hidden">
      {particlesLoaded && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-0"
        />
      )}
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

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white text-gray-800 font-semibold py-4 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <FcGoogle className="w-6 h-6" />
              <span className="text-lg">
                {loading ? "Processing..." : `${isLogin ? "Sign in" : "Sign up"} with Google`}
              </span>
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-t-2 border-gray-800 border-solid rounded-full ml-2"
                />
              )}
            </motion.button>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
          <button
  onClick={() => setIsLogin(!isLogin)}
  className="text-yellow-400 hover:text-yellow-300 transition duration-300 text-lg"
>
  {isLogin ? (
    <>
      Need an account? <span className="text-white">Sign Up</span>
    </>
  ) : (
    <>
      Already have an account? <span className="text-white">Sign In</span>
    </>
  )}
</button>


            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="px-8 pb-8 pt-0 sm:px-12 sm:pb-12 text-center"
          >
            {/* <p className="text-gray-400 text-sm">
              By {isLogin ? "signing in" : "signing up"}, you agree to our{" "}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition duration-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition duration-300">
                Privacy Policy
              </a>
            </p> */}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
