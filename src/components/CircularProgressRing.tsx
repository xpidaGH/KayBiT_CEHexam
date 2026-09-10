import React from 'react';

interface CircularProgressRingProps {
  percentage: number;
  size?: number; // Outer diameter in pixels
  strokeWidth?: number; // Ring thickness
  color?: string; // Main progress color
  trackColor?: string; // Background circle color
  showLabel?: boolean;
  label?: string;
  sublabel?: string;
  className?: string;
  animated?: boolean;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  percentage,
  size = 140,
  strokeWidth = 10,
  color = '#10b981', // emerald-500 default
  trackColor = '#1e293b', // slate-800
  showLabel = true,
  label,
  sublabel,
  className = '',
  animated = true,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, Math.round(percentage)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  // Generate unique gradient ID to avoid collisions
  const gradientId = `ring-grad-${color.replace('#', '')}-${size}-${strokeWidth}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Animated Progress Indicator Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={animated ? 'transition-all duration-700 ease-out' : ''}
        />
      </svg>

      {/* Center Percentage & Descriptive Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span
            className="font-mono font-extrabold text-white tracking-tight"
            style={{ fontSize: size >= 130 ? '1.5rem' : size >= 80 ? '1rem' : '0.75rem' }}
          >
            {clampedPercent}%
          </span>
          {label && (
            <span
              className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5 line-clamp-1"
              style={{ fontSize: size >= 130 ? '0.7rem' : '0.55rem' }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              className="text-[9px] font-mono text-emerald-400/90 line-clamp-1"
              style={{ fontSize: size >= 130 ? '0.65rem' : '0.5rem' }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
