"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import RegisterPageCard from "../components/RegisterPageCard";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(""); // <-- For feedback
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form data:", formData); // 🧪 Log the data

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      });

      setIsError(false);
      setMessage("Successfully created!");

      // ✅ Clear form fields after success
      setFormData({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error("Registration error:", error);
      console.error("Full error response:", error.response);
      setIsError(true);

      if (error.response) {
        setFormData({
        password: "",
        confirmPassword: "",
      });
    const msg =
      error.response.data?.message || "Something went wrong. Try again.";
      setMessage(msg);
    } else {
      setMessage("Server is unreachable. Check connection.");
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
            Create Account
          </h1>
          <p className="text-gray-600">Join CRED-IT to get started</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <RegisterPageCard
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
          {message && (
            <p className="mt-4 text-center text-sm font-medium text-red-500">
              {message}
            </p>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/LoginPage"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in here
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
