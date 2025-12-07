import React from 'react';
import { Menu, User, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '../common';

export default function Header({ toggleSidebar, userName }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50">
      {/* Gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleSidebar}
            className="group relative p-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md"
          >
            <Menu className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
            {/* Animated indicator */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>

          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Icon with gradient background */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-2 sm:p-2.5 rounded-xl shadow-lg">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            {/* Text */}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  CRED
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  -IT
                </span>
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 font-medium">
                Credit Evaluation System
              </p>
            </div>
          </div>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Avatar/Icon */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>

            {/* Avatar circle */}
            <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 p-2 sm:p-2.5 rounded-full border-2 border-blue-200 group-hover:border-blue-400 transition-colors">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              {userName || 'Guest'}
            </span>
            {userName && (
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}