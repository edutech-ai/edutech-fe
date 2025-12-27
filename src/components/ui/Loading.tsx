"use client";

import Image from "next/image";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 40,
  md: 60,
  lg: 80,
  xl: 120,
};

export function Loading({
  size = "md",
  message = "Đang xử lý...",
  fullScreen = false,
}: LoadingProps) {
  const dimension = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <Image
          src="/loading/loading.svg"
          alt="Loading"
          fill
          className="object-contain"
          priority
        />
      </div>
      {message && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Loading Spinner - CSS only (cho quick actions)
export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const spinnerSize = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div
      className={`animate-spin rounded-full border-blue-600 border-t-transparent ${spinnerSize[size]} ${className}`}
    />
  );
}

// Loading Skeleton (cho content loading)
export function LoadingSkeleton({
  className = "",
  rows = 3,
}: {
  className?: string;
  rows?: number;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
