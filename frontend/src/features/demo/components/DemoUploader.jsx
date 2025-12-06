import React, { useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { generateId } from '../../../utils';
import { Button } from '../../../components/common';

export default function DemoUploader({ onProcess }) {
  const [images, setImages] = useState([]);
  const dragIndex = useRef(null);
  const fileInputRef = useRef(null);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const valid = files.filter((f) =>
      ['image/png', 'image/jpeg'].includes(f.type)
    );
    if (!valid.length) return;

    Promise.all(
      valid.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve({
                id: generateId(),
                src: e.target.result,
                name: file.name,
                file,
              });
            reader.readAsDataURL(file);
          })
      )
    ).then((items) => setImages((prev) => [...prev, ...items]));
  };

  const onInputChange = (e) => addFiles(e.target.files);

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onDragStart = (idx) => (dragIndex.current = idx);
  const onDragEnter = (idx) => {
    const from = dragIndex.current;
    if (from === null || from === idx) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    dragIndex.current = idx;
  };
  const onDragEnd = () => (dragIndex.current = null);

  const onDropFiles = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white text-center">
      <h2 className="text-2xl font-bold mb-4">Upload Your Images</h2>

      {/* Upload box */}
      <div
        className="border-2 border-dashed border-white rounded-lg p-6 cursor-pointer hover:bg-white/10 transition"
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDropFiles}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
        <p className="text-blue-100">
          Click (or drop) to upload{' '}
          <span className="font-semibold">.png</span> or{' '}
          <span className="font-semibold">.jpg</span> images
        </p>
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragEnter={() => onDragEnter(idx)}
              onDragEnd={onDragEnd}
              className="relative w-24 h-24 rounded-lg overflow-hidden shadow bg-white cursor-move group"
              title={img.name}
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-full object-cover"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 text-[10px] text-white bg-black/40 px-1 truncate">
                {idx + 1}. {img.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Process button */}
      {images.length >= 1 && (
        <div className="mt-6">
          <Button
            onClick={() => onProcess(images)}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 inline-flex items-center"
          >
            Process <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}