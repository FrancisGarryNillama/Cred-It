import React from "react";

export default function ImagePreviewModal({
  isOpen,
  preview,
  fileName,
  onCancel,
  onContinue,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        onClick={onCancel}
      >
        <div
          className="bg-white rounded-lg p-4 shadow-lg relative max-w-xs w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
            onClick={onCancel}
            aria-label="Close"
          >
            &times;
          </button>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mb-4 max-h-80 mx-auto object-contain rounded"
            />
          )}
          <span className="block mb-4 text-center text-gray-700 dark:text-[#800000] font-semibold">
            Uploaded file: {fileName}
          </span>
          <p className="text-xs text-red-600 font-semibold text-center mb-1">
            The picture must be <span className="underline">clear</span> and in{" "}
            <span className="underline">portrait</span> orientation!
          </p>
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#800000] text-white rounded hover:bg-[#a83232]"
              onClick={onContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
