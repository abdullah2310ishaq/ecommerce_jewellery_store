"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase_services/firebaseConfig";

// Define the shape of our Auth context
interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

// Hook to access the Auth context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start observing auth state
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Provide the auth state to the rest of the app
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
