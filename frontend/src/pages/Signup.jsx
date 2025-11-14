import React, { useState } from "react";
import Illustration from "../assets/login-illustration.png";

import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebase/firebaseConfig";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // ------------------ SIGNUP HANDLER ------------------
  const handleSignup = async () => {
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      // TODO: navigate to login or Shell
    } catch (err) {
      setError(err.message);
    }
  };

  // ------------------ GOOGLE SIGNUP ------------------
  const handleGoogleSignup = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Signup Successful!");
      // TODO: navigate to Shell
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex justify-center items-center relative">

      <div className="w-[90%] h-[80%] bg-gradient-to-br from-[#001219] to-[#003049] rounded-xl shadow-xl flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10">
          <img
            src={Illustration}
            alt="signup illustration"
            className="w-[70%] mb-8"
          />

          <p className="text-white text-xl italic tracking-wide">
            Join Echo & Unlock Your Potential.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col justify-center items-center px-12 py-6 bg-[#d9d9d9]">

          <h1 className="text-3xl font-thin mb-2 tracking-wider">SIGN UP</h1>

          <p className="text-gray-800 mb-6">Create your Echo account</p>

          {/* Error message */}
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

          <div className="w-full max-w-xs">

            {/* Email */}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 border-b border-gray-700 bg-transparent focus:outline-none p-2"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 border-b border-gray-700 bg-transparent focus:outline-none p-2"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border-b border-gray-700 bg-transparent focus:outline-none p-2"
            />

            {/* Sign Up Button */}
            <button
              onClick={handleSignup}
              className="w-full py-2 mt-6 bg-[#014f58] hover:bg-[#013f46] text-white rounded-full transition"
            >
              Create Account
            </button>

            {/* Google Signup */}
            <div className="mt-6 space-y-3">

              <button
                onClick={handleGoogleSignup}
                className="w-full bg-[#4285F4] text-white py-2 rounded flex items-center justify-center gap-2"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                  alt="google"
                  className="w-5 h-5"
                />
                Sign up with Google
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
