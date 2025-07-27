import { X } from "lucide-react";
import { Button } from "./ui/button";

export default function ImagePreviewModal({
  isOpen,
  previewUrl,
  onClose,
  onContinue,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Image Preview</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">
          {previewUrl && (
            <div className="mb-6">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full h-auto mx-auto rounded-lg border border-gray-200"
              />
            </div>
          )}
          <p className="text-gray-600 text-sm mb-6 text-center">
            Please ensure the image is high quality and clearly readable for
            accurate processing.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              className="px-6 py-2 border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
