// firebase/firebaseAuth.ts
import { firebaseAuth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Sign Up User
export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(firebaseAuth, email, password);
};

// Sign In User
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(firebaseAuth, email, password);
};

// Google Sign-In
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(firebaseAuth, provider);
};

// Sign Out
export const logout = async () => {
  return await signOut(firebaseAuth);
};
