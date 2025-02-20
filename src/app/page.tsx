"use client";
import { useRouter } from "next/navigation";

const WelcomePage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Jewelry Store</h1>
      <p className="text-lg text-white-600 mb-6">Discover timeless beauty with our exquisite collection.</p>
      <button 
        onClick={() => router.push("/home")}
        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default WelcomePage;