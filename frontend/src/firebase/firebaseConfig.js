// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlGZaJWdLCImt1O5Yblnx3FEx7F1faMyQ",
  authDomain: "echo-ac32f.firebaseapp.com",
  projectId: "echo-ac32f",
  storageBucket: "echo-ac32f.firebasestorage.app",
  messagingSenderId: "957679024044",
  appId: "1:957679024044:web:5a613591b0181c9af46c09",
  measurementId: "G-LN361X9G6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
};

