import React from 'react';

export default function TorInfo() {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-md mx-auto text-center border border-gray-200">
      <h1 className="text-4xl font-extrabold text-gray-900">
        CRED<span className="text-blue-600">-IT</span>
      </h1>
      <p className="mt-4 text-gray-600 text-lg">
        To start scanning, upload an image of
      </p>
      <p className="text-gray-800 font-semibold">
        your TOR (Transcript of Records)
      </p>
    </div>
  );
}