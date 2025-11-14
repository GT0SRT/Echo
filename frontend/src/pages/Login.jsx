import React, { useState } from "react";
import Illustration from "../assets/login-illustration.png";

import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../firebase/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Login Successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center px-4 py-6">

      <div className="
        w-full max-w-[1200px] 
        min-h-[600px] 
        bg-gradient-to-br from-[#001219] to-[#003049]
        rounded-xl shadow-xl 
        flex flex-col lg:flex-row overflow-hidden
      ">

        {/* LEFT SIDE */}
        <div className="
          w-full lg:w-1/2 
          flex flex-col justify-center items-center 
          p-6 lg:p-10
          text-center lg:text-left
        ">
          <img
            src={Illustration}
            alt="illustration"
            className="w-[60%] md:w-[50%] lg:w-[70%] object-contain mb-8"
          />

          <p className="text-white text-lg md:text-xl italic tracking-wide mt-2">
            Welcome, Unlock your full potential.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="
          w-full lg:w-1/2 
          flex justify-center items-center 
          p-6 lg:p-12
        ">
          {/* CARD */}
          <div className="
            bg-white 
            w-full max-w-[380px] 
            rounded-2xl shadow-xl 
            p-8 sm:p-10
            flex flex-col items-center
          ">
            <h1 className="text-black text-3xl font-light mb-2 tracking-wider">ECHO</h1>
            <p className="text-gray-700 mb-6">Welcome to Echo</p>

            {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

            <div className="w-full">

              <input
                type="text"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full mb-4 
                  border-b border-gray-500 
                   focus:outline-none 
                  p-2
                  text-gray-700
                "
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full 
                  border-b border-gray-500 
                  bg-transparent focus:outline-none 
                  p-2
                  text-gray-700
                "
              />

              <div className="w-full text-right text-xs mt-1">
                <a href="#" className="text-red-600">Forgot password?</a>
              </div>

              <button
                onClick={handleEmailLogin}
                className="
                  w-full py-2 mt-6 
                  bg-[#014f58] hover:bg-[#013f46]
                  text-white rounded-full 
                  transition
                "
              >
                sign in
              </button>

              <p className="text-sm text-gray-600 mt-4">
  Don’t have an account? 
  <a href="/signup" className="text-blue-600 ml-1">Create account</a>
</p>


              <div className="mt-6 space-y-3">

                <button
                  className="
                    w-full bg-[#3b5998] text-white 
                    py-2 rounded 
                    flex items-center justify-center gap-2
                  "
                >
                  <img
                    src='https://cdn-icons-png.flaticon.com/512/145/145802.png'
                    alt="facebook"
                    className="w-5 h-5"
                  />
                  Login with Facebook
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className="
                    w-full bg-[#4285F4] text-white 
                    py-2 rounded 
                    flex items-center justify-center gap-2
                  "
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                    alt="google"
                    className="w-5 h-5"
                  />
                  Login with Google
                </button>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
