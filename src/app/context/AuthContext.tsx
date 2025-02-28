"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase_services/firebaseConfig";

// Define the shape of our Auth context
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
});

// Hook to access the Auth context
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

// Props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    await firebaseAuth.signOut();
    setUser(null); // Update state to remove user from context
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
