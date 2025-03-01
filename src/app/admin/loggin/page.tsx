"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // Store auth token in cookies
      document.cookie = `admin-auth=${password}; path=/; max-age=3600`; // 1 hour session

      // Redirect to Admin
      router.push("/admin");
    } else {
      setError("Invalid password. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-100 p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#FB6F90] text-gray-900"
          required
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button type="submit" className="w-full bg-[#FB6F90] mt-4 p-2 rounded text-white hover:bg-[#FB6F90]/90 transition-colors">
          Login
        </button>
      </form>
    </div>
  );
}
