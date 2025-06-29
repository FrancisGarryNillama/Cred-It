"use client"

import { useState } from "react"
import { Menu, User, Upload } from "lucide-react"
import { Button } from "../components/ui/button"

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-200 relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 opacity-10">
        <img src="/citBackground.png" alt="CIT University Background" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 flex items-center justify-between relative z-30">
        <Button variant="ghost" size="sm" className="text-red-800 hover:bg-yellow-600" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-3">
          {/* Logo */}
          <img src="/navbarCitLogo.png" alt="CIT University Logo" className="h-12 w-auto" />
        </div>

        <div className="flex items-center gap-2 text-red-800">
          <User className="w-6 h-6" />
          <span className="text-sm">(name)</span>
        </div>
      </header>

      {/* Sidebar */}
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

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10" onClick={toggleSidebar} />
      )}

      {/* Main Content */}
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

          {/* Upload Area */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center mb-4 hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-red-700">Click or drag image to this area to upload</p>
          </div>

          <p className="text-red-700 text-sm mb-6">Formats accepted .jpeg .png</p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="px-8 py-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
              Cancel
            </Button>
            <Button className="px-8 py-2 bg-red-800 hover:bg-red-900 text-white">Continue</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
