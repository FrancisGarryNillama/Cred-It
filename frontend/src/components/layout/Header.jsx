import React from 'react';
import { Menu, User, GraduationCap } from 'lucide-react';
import { Button } from '../common';

export default function Header({ toggleSidebar, userName }) {
  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between relative z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-gray-600 hover:bg-gray-100"
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
          {userName || 'Guest'}
        </span>
      </div>
    </header>
  );
}