"use client";

import { Shuffle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RandomTheme } from "@/types/classroom";

interface RandomSettingsProps {
  studentCount: number;
  totalStudents: number;
  pickCount: number;
  onPickCountChange: (count: number) => void;
  onStart: () => void;
  isPlaying: boolean;
  selectedTheme: RandomTheme;
}

export function RandomSettings({
  studentCount,
  totalStudents,
  pickCount,
  onPickCountChange,
  onStart,
  isPlaying,
  selectedTheme,
}: RandomSettingsProps) {
  const maxPick = Math.min(totalStudents, 10);

  return (
    <div className="rounded-xl border border-blue-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800">
        Chọn số lượng học sinh
      </h2>

      <div className="space-y-3">
        {/* Student Count Info */}
        <div className="rounded border border-blue-200 bg-blue-50 px-2 py-1.5">
          <span className="text-sm font-semibold text-blue-600">
            Tổng: {studentCount} học sinh
          </span>
        </div>

        {/* Pick Count */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-800">
            Số lượng chọn ra
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={maxPick}
              value={pickCount}
              onChange={(e) =>
                onPickCountChange(
                  Math.max(1, Math.min(maxPick, parseInt(e.target.value) || 1))
                )
              }
              disabled={isPlaying}
              className="w-16 rounded-lg border border-blue-200 px-2 py-1 text-center text-lg font-bold text-blue-600 transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
            />
            <input
              type="range"
              min="1"
              max={maxPick}
              value={pickCount}
              onChange={(e) => onPickCountChange(parseInt(e.target.value))}
              disabled={isPlaying}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={isPlaying || studentCount === 0}
          className={cn(
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-4 text-sm font-semibold transition-all duration-200 ease-out",
            isPlaying || studentCount === 0
              ? "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400"
              : "border-primary bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md"
          )}
        >
          {isPlaying ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>
                {selectedTheme === "boxes"
                  ? "Click vào hộp quà!"
                  : "Đang chọn..."}
              </span>
            </>
          ) : (
            <>
              <Shuffle className="h-4 w-4" strokeWidth={2.5} />
              <span>
                {selectedTheme === "boxes"
                  ? `Bắt đầu - Chọn ${pickCount} hộp quà`
                  : `Bắt đầu chọn ${pickCount} học sinh`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
