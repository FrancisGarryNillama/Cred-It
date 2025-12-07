import React from 'react';
import {
  Move,
  RotateCw,
  ZoomIn,
  Maximize2
} from 'lucide-react';

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
      label: 'Vertical',
      fullLabel: 'Vertical Perspective',
      value: verticalPerspective,
      min: -45,
      max: 45,
      step: 1,
      onChange: setVerticalPerspective,
      icon: Move,
      color: 'blue',
      unit: '°',
    },
    {
      label: 'Horizontal',
      fullLabel: 'Horizontal Perspective',
      value: horizontalPerspective,
      min: -45,
      max: 45,
      step: 1,
      onChange: setHorizontalPerspective,
      icon: Maximize2,
      color: 'indigo',
      unit: '°',
    },
    {
      label: 'Rotation',
      fullLabel: 'Rotation',
      value: rotate,
      min: -180,
      max: 180,
      step: 1,
      onChange: setRotate,
      icon: RotateCw,
      color: 'purple',
      unit: '°',
    },
    {
      label: 'Zoom',
      fullLabel: 'Preview Zoom',
      value: previewScale,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: setPreviewScale,
      icon: ZoomIn,
      color: 'green',
      unit: 'x',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50/80',
        border: 'border-blue-200',
        icon: 'bg-gradient-to-br from-blue-600 to-indigo-600',
        text: 'text-blue-700',
        slider: 'accent-blue-600',
        track: 'bg-blue-200',
        progress: 'bg-blue-500',
      },
      indigo: {
        bg: 'bg-indigo-50/80',
        border: 'border-indigo-200',
        icon: 'bg-gradient-to-br from-indigo-600 to-purple-600',
        text: 'text-indigo-700',
        slider: 'accent-indigo-600',
        track: 'bg-indigo-200',
        progress: 'bg-indigo-500',
      },
      purple: {
        bg: 'bg-purple-50/80',
        border: 'border-purple-200',
        icon: 'bg-gradient-to-br from-purple-600 to-pink-600',
        text: 'text-purple-700',
        slider: 'accent-purple-600',
        track: 'bg-purple-200',
        progress: 'bg-purple-500',
      },
      green: {
        bg: 'bg-green-50/80',
        border: 'border-green-200',
        icon: 'bg-gradient-to-br from-green-600 to-emerald-600',
        text: 'text-green-700',
        slider: 'accent-green-600',
        track: 'bg-green-200',
        progress: 'bg-green-500',
      },
    };
    return colors[color];
  };

  const formatValue = (value, unit) => {
    const formatted = Math.round(value * 100) / 100;
    return `${formatted}${unit}`;
  };

  const getPercentage = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
      {/* Compact Grid Layout - Camera Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {controls.map((ctrl, index) => {
          const Icon = ctrl.icon;
          const colors = getColorClasses(ctrl.color);
          const percentage = getPercentage(ctrl.value, ctrl.min, ctrl.max);

          return (
            <div
              key={index}
              className={`${colors.bg} border ${colors.border} rounded-lg p-2.5 sm:p-3 transition-all duration-200 hover:shadow-md`}
            >
              {/* Header - Icon, Label, Value */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex-shrink-0 ${colors.icon} p-1.5 rounded-md`}>
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-800 truncate">
                    {ctrl.label}
                  </div>
                </div>
                <div className={`${colors.text} font-bold text-xs sm:text-sm px-2 py-0.5 bg-white rounded-md shadow-sm`}>
                  {formatValue(ctrl.value, ctrl.unit)}
                </div>
              </div>

              {/* Slider - Compact */}
              <div className="relative">
                {/* Track Background */}
                <div className={`h-1.5 ${colors.track} rounded-full`}></div>

                {/* Progress Fill */}
                <div
                  className={`absolute top-0 h-1.5 ${colors.progress} rounded-full transition-all duration-150`}
                  style={{ width: `${percentage}%` }}
                ></div>

                {/* Slider Input */}
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={ctrl.value}
                  onChange={(e) => ctrl.onChange(Number(e.target.value))}
                  className={`absolute top-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-compact ${colors.slider}`}
                />
              </div>

              {/* Min/Max - Very Compact */}
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-gray-400 font-medium">
                  {ctrl.min}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {ctrl.max}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .slider-compact::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          border: 2px solid currentColor;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        .slider-compact::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider-compact::-webkit-slider-thumb:active {
          transform: scale(1.05);
        }

        .slider-compact::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          border: 2px solid currentColor;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        .slider-compact::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider-compact::-moz-range-thumb:active {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}