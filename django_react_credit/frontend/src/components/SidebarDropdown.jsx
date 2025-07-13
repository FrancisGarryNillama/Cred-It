import { Home, UserCircle, FileImage, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function SidebarDropdown({ sidebarOpen }) {
  return (
    <div
      className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white border-r border-gray-200 shadow-lg z-20 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64`}
    >
      <div className="pt-6 px-4">
        <nav className="space-y-2">
          <Link
            to="/HomePage"
            className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/ProfilePage"
            className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <UserCircle className="w-5 h-5" />
            Profile
          </Link>
          <Link
            to="/AboutUsPage"
            className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <FileImage className="w-5 h-5" />
            About Us
          </Link>
          <Link
            to="/LoginPage"
            className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5" />
            Sign Out
          </Link>
        </nav>
      </div>
    </div>
  );
}
