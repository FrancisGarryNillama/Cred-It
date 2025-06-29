import { Menu, User } from "lucide-react";
import { Button } from "../components/ui/button";

export default function CollapsableNavBar({ sidebarOpen, toggleSidebar }) {
  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 flex items-center justify-between relative z-30">
        <Button variant="ghost" size="sm" className="text-red-800 hover:bg-yellow-600" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="text-red-800 text-xs font-bold">CIT</div>
            </div>
          </div>
          <div className="text-red-800 font-bold text-lg">
            <div>CEBU INSTITUTE OF TECHNOLOGY</div>
            <div className="text-center text-sm tracking-wider">UNIVERSITY</div>
          </div>
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
    </>
  );
}
