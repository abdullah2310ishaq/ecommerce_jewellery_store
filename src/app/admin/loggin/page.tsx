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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded text-black"
          required
        />
        {error && <p className="text-red-400 mt-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 mt-4 p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
