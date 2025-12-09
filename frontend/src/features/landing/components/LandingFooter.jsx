import React from 'react';
import { GraduationCap, Heart, Github, Mail } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-center">
          {/* Logo & Description */}
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">CRED-IT</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Streamlining Academic Accreditation
              </p>
            </div>
          </div>

          {/* Links - Centered */}
          <div className="flex justify-center space-x-6 order-last sm:order-none">
            <button className="text-gray-400 hover:text-blue-600 transition-colors p-2" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-blue-600 transition-colors p-2" aria-label="Email">
              <Mail className="h-5 w-5" />
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-end">
              Made with <Heart className="h-3 w-3 sm:h-4 sm:w-4 mx-1 text-red-500" /> by CIT-U CCS
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
              © 2024 CRED-IT. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}