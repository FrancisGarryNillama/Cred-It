"use client"

import { useState, useRef } from "react";
import { Menu, User, Upload, X } from "lucide-react";
import { Button } from "../components/ui/button";
import HomePageBackgroundLayout from "../components/HomePageBackgroundLayout";

export default function Component() {
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
      <HomePageBackgroundLayout>
      {}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 flex items-center justify-between relative z-30">
        <Button variant="ghost" size="sm" className="text-red-800 hover:bg-yellow-600" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-3">
          {}
          <img src="/navbarCitLogo.png" alt="CIT University Logo" className="h-12 w-auto" />
        </div>

        <div className="flex items-center gap-2 text-red-800">
          <User className="w-6 h-6" />
          <span className="text-sm">(name)</span>
        </div>
      </header>

      {}
      <div
        className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-red-800 text-white z-20 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="pt-4 px-4">
          <nav className="space-y-2">
            <a href="#" className="block py-3 px-4 text-white hover:bg-red-700 rounded transition-colors">
              Home
            </a>
            <a href="#" className="block py-3 px-4 text-white hover:bg-red-700 rounded transition-colors">
              Profile
            </a>
            <a href="#" className="block py-3 px-4 text-white hover:bg-red-700 rounded transition-colors">
              Upload Img
            </a>
            <a href="#" className="block py-3 px-4 text-white hover:bg-red-700 rounded transition-colors">
              About Us
            </a>
          </nav>
        </div>
      </div>

      {}
      {sidebarOpen && (
        <div className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10" onClick={toggleSidebar} />
      )}
      {}
      <main
        className={`flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 relative z-10 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-red-800 mb-6">CRED-IT</h1>
          <p className="text-red-700 text-lg mb-2">To start scanning upload an image of</p>
          <p className="text-red-700 text-lg">your TOR</p>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-4">Image Upload</h2>

          {}
          <div
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center mb-4 hover:border-gray-400 transition-colors cursor-pointer"
            onClick={handleUploadAreaClick}
          >
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-red-700">Click or drag image to this area to upload</p>
             {selectedFile && <p className="text-green-600 mt-2">File selected: {selectedFile.name}</p>}
          </div>

          <p className="text-red-700 text-sm mb-6">Formats accepted .jpeg .png</p>

          {}
          <div className="flex gap-4 justify-center">
            {} 
            <Button variant="outline" className="px-8 py-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
              Cancel
            </Button>
            {} 
            <Button 
              className="px-8 py-2 bg-red-800 hover:bg-red-900 text-white"
              onClick={handleContinueClick}
            >
              Continue
            </Button>
          </div>

           {}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-semibold text-red-800">Image Preview</h3>
                             <Button variant="ghost" size="sm" onClick={handleDialogClose} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                             </Button>
                        </div>
                       
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="max-w-full h-auto mx-auto mb-4" />
                        )}

                        <p className="text-red-700 text-sm mb-6">
                            Please ensure the image is high quality and in portrait orientation.
                        </p>

                        <div className="flex justify-end gap-4">
                            <Button 
                                variant="outline" 
                                className="px-4 py-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                onClick={handleDialogClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white"
                                onClick={handleDialogContinue}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            )}


        </div>
      </main>
      </HomePageBackgroundLayout>
  )
}


