import React from 'react';
import { Modal, ModalContent, ModalFooter, Button } from '../../../../components/common';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import EditorControls from './EditorControls';

export default function EditorDialog({
  isOpen,
  onClose,
  image,
  crop,
  onCropChange,
  onCropComplete,
  onImageLoad,
  imgRef,
  previewRef,
  imageTransformStyle,
  percentCrop,
  previewScale,
  verticalPerspective,
  horizontalPerspective,
  rotate,
  setVerticalPerspective,
  setHorizontalPerspective,
  setRotate,
  setPreviewScale,
  onSave,
  isEditing,
  setIsEditing,
}) {
  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Image" size="full">
      <ModalContent>
        {!isEditing ? (
          <div className="text-center py-8">
            <img
              src={image.src}
              alt="Preview"
              className="max-w-md h-auto mx-auto rounded-lg border"
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start h-[70vh]">
            {/* Edit View */}
            <div className="w-full md:w-1/2">
              <h4 className="text-lg font-medium text-center mb-2">Edit</h4>
              <div
                style={{
                  perspective: '1000px',
                  height: '400px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <ReactCrop
                  crop={crop}
                  onChange={onCropChange}
                  onComplete={onCropComplete}
                >
                  <img
                    ref={imgRef}
                    alt="Edit"
                    src={image.src}
                    style={{
                      transform: `scale(${previewScale}) ${imageTransformStyle.transform}`,
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            </div>

            {/* Live Preview */}
            <div className="w-full md:w-1/2 text-center">
              <h4 className="text-lg font-medium text-center mb-2">
                Live Preview
              </h4>
              <div
                ref={previewRef}
                className="relative w-full h-[400px] mx-auto rounded-md overflow-hidden"
                style={{
                  perspective: '1000px',
                  border: '1px solid #ccc',
                  background: '#f8f8f8',
                }}
              >
                <div
                  style={{
                    ...imageTransformStyle,
                    transform: `scale(${previewScale}) ${imageTransformStyle.transform}`,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    alt="Live Preview"
                    src={image.src}
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      clipPath: percentCrop
                        ? `inset(${percentCrop.y}% ${
                            100 - (percentCrop.x + percentCrop.width)
                          }% ${
                            100 - (percentCrop.y + percentCrop.height)
                          }% ${percentCrop.x}%)`
                        : 'none',
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'center',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <EditorControls
            verticalPerspective={verticalPerspective}
            setVerticalPerspective={setVerticalPerspective}
            horizontalPerspective={horizontalPerspective}
            setHorizontalPerspective={setHorizontalPerspective}
            rotate={rotate}
            setRotate={setRotate}
            previewScale={previewScale}
            setPreviewScale={setPreviewScale}
          />
        )}
      </ModalContent>

      <ModalFooter>
        {!isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button onClick={onSave}>Done</Button>
          </>
        ) : (
          <Button onClick={onSave}>Done Editing</Button>
        )}
      </ModalFooter>
    </Modal>
  );
}