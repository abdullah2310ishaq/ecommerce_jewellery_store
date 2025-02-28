"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase_services/firebaseConfig";

// Define the shape of our Auth context
interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

// Create context with a default value
const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

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

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
