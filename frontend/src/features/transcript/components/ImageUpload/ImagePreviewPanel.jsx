import React from 'react';
import { Modal, ModalContent, ModalFooter, Button, Loader } from '../../../../components/common';

export default function ImagePreviewPanel({
  isOpen,
  images,
  onClose,
  onProcess,
  onEditImage,
  loading,
}) {
  const getTransformStyle = (img) => {
    if (!img.transform) return {};
    const { vertical, horizontal, rotation, zoom } = img.transform;
    return {
      transform: `
        perspective(1000px)
        rotateX(${vertical}deg)
        rotateY(${horizontal}deg)
        rotate(${rotation}deg)
        scale(${zoom})
      `,
    };
  };

  const handleViewImage = (img) => {
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head><title>View Image</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#000;">
          <img src="${img.src}" style="max-width:100%; max-height:100%; ${
            img.transform ? `transform:${getTransformStyle(img).transform};` : ''
          }" />
        </body>
      </html>
    `);
  };

  const handleDownload = (img) => {
    const link = document.createElement('a');
    link.href = img.src;
    link.download = img.name || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Image Preview and Edit" size="xl">
      <ModalContent>
        {loading ? (
          <div className="py-20">
            <Loader text="Processing OCR..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div key={index} className="flex flex-col items-center space-y-3">
                <img
                  src={img.src}
                  alt={`img-${index}`}
                  className="rounded shadow object-cover w-full h-48"
                  style={getTransformStyle(img)}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => onEditImage(img)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewImage(img)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(img)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalContent>

      {!loading && (
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onProcess}>
            Process
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}