"use client";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import firebaseApp from "./firebaseConfig"; // your existing config

const auth = getAuth(firebaseApp);

/** Register (Sign Up) with email/password and optional displayName */
export async function registerUser(email: string, password: string, displayName: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // If displayName provided, update user profile
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
}

/** Login (Sign In) with email/password */
export async function loginUser(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/** Logout (Sign Out) the current user */
export async function logoutUser() {
  await signOut(auth);
}

/** Observe Auth State changes in real-time */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/** Sign in with Google (popup) */
export async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
