import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";

export default function ImageUploader({
  selectedFile,
  setSelectedFile,
  setPreviewUrl,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        alert("Please select a JPEG or PNG image file.");
        setSelectedFile(null);
        setPreviewUrl(null);
        event.target.value = "";
      }
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center mb-6 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
      onClick={handleUploadAreaClick}
    >
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
      <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
        Click or drag image to this area to upload
      </p>
      {selectedFile && (
        <p className="text-green-600 mt-3 font-medium">
          ✓ File selected: {selectedFile.name}
        </p>
      )}
    </div>
  );
}
