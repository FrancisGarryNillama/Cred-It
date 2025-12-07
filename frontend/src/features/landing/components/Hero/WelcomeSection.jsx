import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

export default function WelcomeSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative text-center mb-6 sm:mb-8 px-2">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Badge */}
        <div
          className={`inline-flex items-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 
            text-blue-700 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold 
            mb-4 sm:mb-6 md:mb-8 border border-blue-200/50 shadow-lg shadow-blue-200/50
            backdrop-blur-sm hover:shadow-xl hover:shadow-blue-300/50 
            transition-all duration-500 cursor-pointer group
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          `}
        >
          <div className="relative flex items-center">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative">
              AI-Powered Credit Accreditation
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </span>
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        {/* Enhanced Title */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight
            transition-all duration-1000 delay-100
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <span className="block mb-2">Welcome to</span>
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent
              animate-gradient-x bg-300%"
              style={{
                backgroundSize: '300% 300%',
                animation: 'gradient-shift 5s ease infinite',
              }}
            >
              CRED-IT
            </span>
            {/* Underline decoration */}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full
              transform origin-left transition-transform duration-1000 delay-500"
              style={{
                transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
              }}
            ></div>
            {/* Sparkle decoration */}
            <TrendingUp className="absolute -top-4 -right-8 sm:-right-12 h-6 w-6 sm:h-8 sm:w-8 text-blue-500 opacity-70
              animate-bounce hidden sm:block"
              style={{ animationDelay: '1s' }}
            />
          </span>
        </h1>

        {/* Enhanced Subtitle */}
        <p
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 font-medium max-w-3xl mx-auto px-2
            leading-relaxed transition-all duration-1000 delay-300
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          Transforming transcript evaluation with{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">
              intelligent automation
            </span>
            <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
              <path d="M0,2 Q25,0 50,2 T100,2" stroke="url(#gradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </p>

        {/* Stats or Features Preview */}
        <div
          className={`mt-8 sm:mt-10 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8
            transition-all duration-1000 delay-500
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {[
            { label: 'Accuracy', value: '99%', icon: '🎯' },
            { label: 'Faster', value: '10x', icon: '⚡' },
            { label: 'Secure', value: '100%', icon: '🔒' },
          ].map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-gray-200/50 
                shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent
                group-hover:scale-110 transition-transform duration-300 inline-block">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1 flex items-center gap-1">
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-indigo-400/0 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add this to your CSS to make the gradient animation work
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}