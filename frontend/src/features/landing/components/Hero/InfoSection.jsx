import React from 'react';

export default function InfoSection() {
  return (
    <div className="text-center space-y-6">
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        A comprehensive software solution designed to streamline the
        administrative burden on department staff, enhance decision-making
        efficiency, and aid transferee students with faster Accreditation results.
      </p>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 leading-relaxed">
          Our system revolutionizes the traditional approach to Accreditation
          by eliminating manual processes and introducing Optical Character
          Recognition, intelligent assessment tools. Say goodbye to
          time-consuming manual evaluations and embrace a future of
          streamlined academic transitions that benefit students, faculty,
          and institutions alike.
        </p>
      </div>
    </div>
  );
}