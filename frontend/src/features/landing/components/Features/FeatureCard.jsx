import React from 'react';

export default function FeatureCard({ icon: Icon, title, description, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}