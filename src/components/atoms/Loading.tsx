"use client";

import Image from "next/image";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  message?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 150,
  md: 300,
  lg: 450,
  xl: 600,
  "2xl": 750,
  "3xl": 900,
};

export function Loading({
  size = "3xl",
  message = "Đang xử lý...",
  fullScreen = false,
}: LoadingProps) {
  const dimension = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 bg-transparent">
      <div
        className="relative bg-transparent"
        style={{ width: dimension, height: dimension }}
      >
        <Image
          src="/loading/loading.gif"
          alt="Loading"
          width={dimension}
          height={dimension}
          className="object-contain bg-transparent"
          priority
          unoptimized
        />
      </div>
      {message && (
        <p className="text-gray-700 text-3xl font-bold animate-pulse mt-12">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-white/95">
        <div className="flex flex-col items-center justify-center gap-4 bg-transparent w-screen h-screen">
          <div
            className="relative bg-transparent"
            style={{
              width: "80vmin",
              height: "80vmin",
              maxWidth: "1000px",
              maxHeight: "1000px",
            }}
          >
            <Image
              src="/loading/loading_ai.gif"
              alt="Loading"
              fill
              className="object-contain bg-transparent"
              priority
              unoptimized
            />
          </div>
          {message && (
            <p className="text-gray-700 text-4xl font-bold animate-pulse mt-12">
              {message}
            </p>
          )}
        </div>
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
          className="h-4 rounded animate-pulse"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
