"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import LoginPageCard from "../components/LoginPageCard";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

      console.log("Login Response:", res.data);

      if (res.status === 200) {
        const { name } = res.data; // <- Get the name from response
        localStorage.setItem("userName", name); // <- Store it
        setError("Login successful! Redirecting...");
        navigate("/HomePage");
      }
    } catch (err) {
      if (err.response) {
        const backendError = 
        err.response.data.error ||
        err.response.data.message || 
        "Invalid email or password";
        setError(backendError);
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your CRED-IT account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <LoginPageCard
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/RegisterPage"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 CRED-IT. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
