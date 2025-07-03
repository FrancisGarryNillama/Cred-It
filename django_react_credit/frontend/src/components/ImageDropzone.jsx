import React, { useRef, useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";

export default function ImageDropzone({ onDrop }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      if (onDrop) onDrop(file);
    } else {
      setFileName("");
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      if (onDrop) onDrop(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-[#FFFFFF] hover:bg-yellow-100 dark:hover:bg-[#ffcccc] dark:border-gray-600 dark:hover:border-gray-500 mx-auto"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full">
            {fileName ? (
              <span className="mb-2 text-sm text-gray-700 dark:text-[#800000] font-semibold">
                Uploaded file: {fileName}
              </span>
            ) : (
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-[#800000]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
            )}
            <p className="mb-2 text-sm text-gray-500 dark:text-[#800000]">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-red-600 dark:text-red-700 font-semibold">
              The picture must be <span className="underline">clear</span> and
              in <span className="underline">portrait</span> orientation!
            </p>
            <p className="text-xs text-gray-500 dark:text-[#800000]">
              PNG, JPG or GIF (TOR must be Vertical)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </label>
        {fileName && (
          <button
            className="mt-4 px-4 py-2 bg-[#800000] text-white rounded hover:bg-[#a83232] mx-auto block"
            onClick={() => setIsModalOpen(true)}
          >
            Continue
          </button>
        )}
      </div>

      {/* Modal Preview */}
      <ImagePreviewModal
        isOpen={isModalOpen}
        preview={preview}
        fileName={fileName}
        onCancel={handleCloseModal}
      />
    </>
  );
}
