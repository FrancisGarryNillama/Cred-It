import React from 'react';

export default function EditorControls({
  verticalPerspective,
  setVerticalPerspective,
  horizontalPerspective,
  setHorizontalPerspective,
  rotate,
  setRotate,
  previewScale,
  setPreviewScale,
}) {
  const controls = [
    {
      label: 'Vertical Perspective',
      value: verticalPerspective,
      min: -45,
      max: 45,
      step: 1,
      onChange: setVerticalPerspective,
    },
    {
      label: 'Horizontal Perspective',
      value: horizontalPerspective,
      min: -45,
      max: 45,
      step: 1,
      onChange: setHorizontalPerspective,
    },
    {
      label: 'Rotation',
      value: rotate,
      min: -180,
      max: 180,
      step: 1,
      onChange: setRotate,
    },
    {
      label: 'Preview Zoom',
      value: previewScale,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: setPreviewScale,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      {controls.map((ctrl, index) => (
        <div key={index} className="w-full px-4 text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ctrl.label}:{' '}
            <span className="font-bold">
              {Math.round(ctrl.value * 100) / 100}
            </span>
          </label>
          <input
            type="range"
            min={ctrl.min}
            max={ctrl.max}
            step={ctrl.step}
            value={ctrl.value}
            onChange={(e) => ctrl.onChange(Number(e.target.value))}
            className="w-[75%] mx-auto block accent-blue-500"
          />
        </div>
      ))}
    </div>
  );
}