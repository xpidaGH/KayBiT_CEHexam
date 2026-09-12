import React from 'react';
import { PLATFORM_VECTOR_PATHS } from './platformAssetsData';

/**
 * Structured SVG Path Data & Platform Brand Icons
 * Centralized for clean reuse, scalability, and zero JSX clutter.
 */

export interface SvgIconProps {
  className?: string;
  size?: number;
}

export const PlatformSvgIcons = {
  // Microsoft Windows Logo
  Windows: ({ className = 'w-5 h-5', size }: SvgIconProps) => (
    <svg
      viewBox={PLATFORM_VECTOR_PATHS.windows.viewBox}
      className={className}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={PLATFORM_VECTOR_PATHS.windows.d} />
    </svg>
  ),

  // Apple macOS / iOS Logo
  Apple: ({ className = 'w-5 h-5', size }: SvgIconProps) => (
    <svg
      viewBox={PLATFORM_VECTOR_PATHS.apple.viewBox}
      className={className}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={PLATFORM_VECTOR_PATHS.apple.d} />
    </svg>
  ),

  // Google Android Robot Logo
  Android: ({ className = 'w-5 h-5', size }: SvgIconProps) => (
    <svg
      viewBox={PLATFORM_VECTOR_PATHS.android.viewBox}
      className={className}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={PLATFORM_VECTOR_PATHS.android.d} />
    </svg>
  ),

  // Linux Tux / Terminal Penguin
  Linux: ({ className = 'w-5 h-5', size }: SvgIconProps) => (
    <svg
      viewBox={PLATFORM_VECTOR_PATHS.linux.viewBox}
      className={className}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={PLATFORM_VECTOR_PATHS.linux.d} />
    </svg>
  ),

  // Web Browser / PWA Icon
  PwaWeb: ({ className = 'w-5 h-5', size }: SvgIconProps) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

