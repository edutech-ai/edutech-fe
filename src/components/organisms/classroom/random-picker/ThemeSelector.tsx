"use client";

import {
  Disc3,
  Trophy,
  Gamepad2,
  Gift,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RandomTheme } from "@/types/classroom";
import { RANDOM_THEMES } from "@/types/classroom";

const THEME_ICONS: Record<RandomTheme, LucideIcon> = {
  wheel: Disc3,
  race: Trophy,
  claw: Gamepad2,
  boxes: Gift,
};

interface ThemeSelectorProps {
  selectedTheme: RandomTheme;
  onSelectTheme: (theme: RandomTheme) => void;
  disabled?: boolean;
}

export function ThemeSelector({
  selectedTheme,
  onSelectTheme,
  disabled,
}: ThemeSelectorProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-base font-bold text-slate-800">
        Chọn Hình Thức
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {RANDOM_THEMES.map((theme) => {
          const Icon = THEME_ICONS[theme.id];
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              disabled={disabled}
              className={cn(
                "relative cursor-pointer rounded-lg border p-2 transition-all duration-200 ease-out",
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-blue-200 bg-white hover:border-blue-400",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                    isSelected
                      ? "border-blue-700 bg-blue-600"
                      : "border-blue-200 bg-blue-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isSelected ? "text-white" : "text-blue-600"
                    )}
                    strokeWidth={2.5}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-blue-600" : "text-slate-600"
                  )}
                >
                  {theme.label}
                </span>
              </div>

              {isSelected && (
                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-primary">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
