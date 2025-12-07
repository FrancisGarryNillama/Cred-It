import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Users, BookOpen } from 'lucide-react';
import FeatureCard from './FeatureCard';

export default function FeaturesGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: CheckCircle,
      title: 'Simplified Process',
      description: 'Standardizes course comparison and accreditation between institutions',
      color: 'green',
    },
    {
      icon: Users,
      title: 'Enhanced Efficiency',
      description: 'Improves efficiency, transparency, and academic advising processes',
      color: 'blue',
    },
    {
      icon: BookOpen,
      title: 'Smart Decisions',
      description: 'Faster, smarter decisions for both students and educational institutions',
      color: 'purple',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full">
      {/* Title with animation */}
      <h2
        className={`text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center transition-all duration-1000
          ${isVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95'
          }
        `}
      >
        Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CRED-IT</span>?
      </h2>

      {/* Feature cards grid with staggered animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`transition-all duration-1000 ease-out
              ${isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-90'
              }
            `}
            style={{
              transitionDelay: `${index * 200}ms`,
            }}
          >
            <FeatureCard {...feature} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}