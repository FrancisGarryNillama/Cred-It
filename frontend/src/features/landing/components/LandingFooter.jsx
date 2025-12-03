import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">CRED-IT</h3>
              <p className="text-sm text-gray-500">
                Streamlining Administrative Burden
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 CRED-IT. Empowering educational institutions worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}