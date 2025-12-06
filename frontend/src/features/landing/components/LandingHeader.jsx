import React from 'react';
import { GraduationCap } from 'lucide-react';
import { AuthButtons } from '../../auth';

export default function LandingHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                CRED<span className="text-blue-600">-IT</span>
              </h1>
              <p className="text-sm text-gray-500">
                Credit Accreditation System
              </p>
            </div>
          </div>
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}