"use client";

import Image from "next/image";

interface CoreLoadingProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 60,
  md: 80,
  lg: 120,
};

export function CoreLoading({
  size = "md",
  message = "Đang tải...",
  fullScreen = false,
}: CoreLoadingProps) {
  const dimension = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <Image
          src="/loading/loading3.gif"
          alt="Loading"
          width={dimension}
          height={dimension}
          className="object-contain"
          priority
          unoptimized
        />
      </div>
      {message && (
        <p className="text-gray-700 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-9999 bg-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative w-full h-full">
            <Image
              src="/loading/loading3.gif"
              alt="Loading"
              width={400}
              height={400}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          {message && (
            <p className="text-gray-700 text-lg font-semibold animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return content;
}
