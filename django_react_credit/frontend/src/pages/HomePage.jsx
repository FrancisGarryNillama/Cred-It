"use client";

import { useEffect, useState } from "react";
import { Menu, User, GraduationCap } from "lucide-react";
import { Button } from "../components/ui/button";
import SidebarDropdown from "../components/SidebarDropdown";
import ImageUploader from "../components/ImageUploader";
import ImagePreviewModal from "../components/ImagePreviewModal";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          <span className="text-sm font-medium">
            {userName ? userName : "No name"}
          </span>

        </div>
      </header>

      {/* Sidebar */}
      <SidebarDropdown sidebarOpen={sidebarOpen} />

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
            <ImageUploader
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              setPreviewUrl={setPreviewUrl}
            />

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
        <ImagePreviewModal
          isOpen={isDialogOpen}
          previewUrl={previewUrl}
          onClose={handleDialogClose}
          onContinue={handleDialogContinue}
        />
      </main>
    </div>
  );
}
