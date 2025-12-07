import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { AuthButtons } from '../../auth';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={`backdrop-blur-md sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/95 shadow-lg border-b border-gray-200'
          : 'bg-white/80 shadow-sm border-b border-gray-100'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2.5 sm:py-3 md:py-4">
          {/* Logo Section - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
            <div className={`bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl 
              shadow-lg transition-all duration-300
              ${scrolled ? 'shadow-blue-500/30' : 'shadow-blue-500/25'}
              group-hover:shadow-blue-500/40 group-hover:scale-105
            `}>
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                CRED<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">-IT</span>
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 font-medium tracking-wide">
                Credit Accreditation System
              </p>
            </div>
          </div>
          {/* Auth Buttons */}
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}