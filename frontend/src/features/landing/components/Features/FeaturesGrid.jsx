import React from 'react';
import { CheckCircle, Users, BookOpen } from 'lucide-react';
import FeatureCard from './FeatureCard';

export default function FeaturesGrid() {
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

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}