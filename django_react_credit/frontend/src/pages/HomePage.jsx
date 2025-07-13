"use client";

import { useState, useRef } from "react";
import {
  Menu,
  User,
  Upload,
  X,
  GraduationCap,
  Home,
  UserCircle,
  FileImage,
  Info,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        alert("Please select a JPEG or PNG image file.");
        setSelectedFile(null);
        setPreviewUrl(null);
        event.target.value = "";
      }
    }
  };

  const handleContinueClick = () => {
    if (selectedFile) {
      setIsDialogOpen(true);
    } else {
      alert("Please upload an image first.");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogContinue = () => {
    console.log("Proceeding with file:", selectedFile);
    setIsDialogOpen(false);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                CRED<span className="text-blue-600">-IT</span>
              </h1>
              <p className="text-xs text-gray-500">Credit Evaluation System</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">(name)</span>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white border-r border-gray-200 shadow-lg z-20 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="pt-6 px-4">
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <UserCircle className="w-5 h-5" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <FileImage className="w-5 h-5" />
              Upload Image
            </a>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5" />
              About Us
            </a>
          </nav>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 relative z-10 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            CRED<span className="text-blue-600">-IT</span>
          </h1>
          <div className="space-y-2">
            <p className="text-gray-600 text-lg">
              To start scanning, upload an image of
            </p>
            <p className="text-gray-600 text-lg font-medium">
              your TOR (Transcript of Records)
            </p>
          </div>
        </div>

        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-gray-900 font-semibold text-xl mb-6 text-center">
              Upload Document
            </h2>

            {/* Upload Area */}
            <div
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center mb-6 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
              onClick={handleUploadAreaClick}
            >
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
              <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
                Click or drag image to this area to upload
              </p>
              {selectedFile && (
                <p className="text-green-600 mt-3 font-medium">
                  ✓ File selected: {selectedFile.name}
                </p>
              )}
            </div>

            <p className="text-gray-500 text-sm mb-8 text-center">
              Supported formats: JPEG, PNG
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                className="px-8 py-2 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleContinueClick}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Image Preview
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDialogClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6">
                {previewUrl && (
                  <div className="mb-6">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full h-auto mx-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <p className="text-gray-600 text-sm mb-6 text-center">
                  Please ensure the image is high quality and clearly readable
                  for accurate processing.
                </p>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    className="px-6 py-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleDialogContinue}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
