import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackgroundLayout from "../components/BackgroundLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    navigate("/HomePage");
  };

  return (
    <BackgroundLayout>
      <div className="relative w-full max-w-[1200px] mx-auto p-5 z-20 flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg p-10 w-full max-w-md shadow-md mt-16">
          <h1 className="text-2xl font-bold text-center text-red-900 mb-2">
            Student Portal
          </h1>
          <p className="text-sm text-center text-gray-600 mb-8">
            Sign in to access your account
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-5">
              <label className="block text-sm font-medium text-red-900 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8B0000"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-red-900 mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8B0000"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded text-sm focus:outline-none"
                />
              </div>
            </div>

            {showWarning && !isFormValid && (
              <div className="text-red-600 text-sm mb-3 text-center">
                Please fill in both username and password.
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-sm text-red-900">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-900 text-white rounded text-base font-medium transition hover:bg-red-800 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Don't have an account?
            <Link to={"/RegisterPage"}>
              <strong className="ml-1 text-red-900 hover:underline">
                Register here
              </strong>
            </Link>
          </p>
        </div>

        <div className="mt-16 pt-10">
          <p className="text-xs text-[#800000] text-center">
            2024 Cebu Institute of Technology University. All rights reserved.
          </p>
        </div>
      </div>
    </BackgroundLayout>
  );
}
