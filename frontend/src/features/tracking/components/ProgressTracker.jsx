import React, { useState } from 'react';
import { useTracking } from '../hooks/useTracking';
import { Button, Loader } from '../../../components/common';
import TrackerModal from './TrackerModal';

export default function ProgressTracker({ userName }) {
  const { progress, loading } = useTracking(userName);
  const [showModal, setShowModal] = useState(false);

  const steps = ['Request', 'Pending', 'Finalized'];

  if (progress === 0) return null;

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-md mt-12">
        <h2 className="text-xl font-semibold mb-4 text-center text-indigo-700">
          Tracking Progress
        </h2>

        {loading ? (
          <Loader size="sm" />
        ) : (
          <>
            {/* Progress Bar */}
            <div className="relative flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex-1 relative flex items-center justify-center"
                >
                  <div
                    className={`h-3 w-full rounded-full transition-all duration-500 ${
                      index < progress ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span
                    className={`absolute top-4 text-sm ${
                      index < progress
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* View Button */}
            {progress === 3 && (
              <div className="flex justify-center">
                <Button
                  variant="success"
                  onClick={() => setShowModal(true)}
                >
                  View Tracker Accreditation
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <TrackerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userName={userName}
      />
    </>
  );
}