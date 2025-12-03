import React from 'react';
import { BookOpen } from 'lucide-react';

export default function WelcomeSection() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <BookOpen className="h-4 w-4 mr-2" />
        Administrative Technology System
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Welcome to{' '}
        <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          CRED-IT
        </span>
      </h1>
    </div>
  );
}