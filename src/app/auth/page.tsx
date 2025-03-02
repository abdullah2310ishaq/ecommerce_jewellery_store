"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import Swal from "sweetalert2"
import { googleSignIn } from "@/app/firebase/firebase_services/firebaseAuth"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"

export default function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Handle Google authentication
  const handleGoogleAuth = async () => {
    try {
      console.log("[DEBUG] Initiating Google sign-in process...")
      setLoading(true)
      setError("")
      const user = await googleSignIn()
      console.log(`[DEBUG] Google sign-in success: ${user.email}`)
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed in successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
      router.push("/home")
    } catch (err) {
      console.error("[DEBUG] Google auth failed:", err)
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-10">
            <div className="text-center">
              <motion.div
                className="mx-auto mb-6 w-24 h-24 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="/logo.png" alt="Brand Logo" className="w-full h-full object-contain" />
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome</h2>

              <p className="text-gray-600 mb-8">Sign in to continue your journey</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg font-medium shadow-sm hover:shadow-md transition duration-200 flex items-center justify-center gap-3 border border-gray-200"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="text-base font-medium text-gray-800">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </motion.button>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <LogIn className="h-4 w-4" />
                <p className="text-sm">Secure authentication powered by Google</p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-6 pt-0 text-center">
            <p className="text-xs text-gray-500">By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

