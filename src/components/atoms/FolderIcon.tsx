"use client";

export type FolderColorBackend =
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "purple"
  | "red";

// Extended colors for UI (includes backend + extra for later use)
export type FolderColor =
  | FolderColorBackend
  | "pink"
  | "indigo"
  | "teal"
  | "gray";

interface FolderIconProps {
  color?: FolderColor;
  className?: string;
  size?: number;
}

const colorSchemes: Record<
  FolderColor,
  { main: string; accent: string; shadow: string }
> = {
  blue: {
    main: "#60A5FA",
    accent: "#3B82F6",
    shadow: "#2563EB",
  },
  green: {
    main: "#4ADE80",
    accent: "#22C55E",
    shadow: "#16A34A",
  },
  purple: {
    main: "#C084FC",
    accent: "#A855F7",
    shadow: "#9333EA",
  },
  yellow: {
    main: "#FBBF24",
    accent: "#F59E0B",
    shadow: "#D97706",
  },
  red: {
    main: "#F87171",
    accent: "#EF4444",
    shadow: "#DC2626",
  },
  orange: {
    main: "#FB923C",
    accent: "#F97316",
    shadow: "#EA580C",
  },
  pink: {
    main: "#F472B6",
    accent: "#EC4899",
    shadow: "#DB2777",
  },
  indigo: {
    main: "#818CF8",
    accent: "#6366F1",
    shadow: "#4F46E5",
  },
  teal: {
    main: "#2DD4BF",
    accent: "#14B8A6",
    shadow: "#0D9488",
  },
  gray: {
    main: "#9CA3AF",
    accent: "#6B7280",
    shadow: "#4B5563",
  },
};

export function FolderIcon({
  color = "blue",
  className = "",
  size = 64,
}: FolderIconProps) {
  const scheme = colorSchemes[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shadow */}
      <ellipse
        cx="32"
        cy="58"
        rx="24"
        ry="3"
        fill={scheme.shadow}
        opacity="0.2"
      />

      {/* Folder back */}
      <path
        d="M6 16C6 13.7909 7.79086 12 10 12H24L28 18H54C56.2091 18 58 19.7909 58 22V50C58 52.2091 56.2091 54 54 54H10C7.79086 54 6 52.2091 6 50V16Z"
        fill={scheme.main}
      />

      {/* Folder tab shadow */}
      <path
        d="M24 12L28 18H54C56.2091 18 58 19.7909 58 22V24H6V16C6 13.7909 7.79086 12 10 12H24Z"
        fill={scheme.accent}
        opacity="0.6"
      />

      {/* Folder front overlay */}
      <path
        d="M8 22C8 20.8954 8.89543 20 10 20H54C55.1046 20 56 20.8954 56 22V50C56 51.1046 55.1046 52 54 52H10C8.89543 52 8 51.1046 8 50V22Z"
        fill={scheme.accent}
      />

      {/* Highlight */}
      <path
        d="M10 20C8.89543 20 8 20.8954 8 22V28H56V22C56 20.8954 55.1046 20 54 20H10Z"
        fill="white"
        opacity="0.2"
      />

      {/* Tab */}
      <path
        d="M24 12H10C7.79086 12 6 13.7909 6 16V20H26.8284C27.298 20 27.7481 19.8127 28.0731 19.4804L30 17.5L28.0731 15.5196C27.7481 15.1873 27.298 15 26.8284 15H24V12Z"
        fill={scheme.main}
      />
    </svg>
  );
}

export const BACKEND_FOLDER_COLORS: FolderColorBackend[] = [
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "red",
];

// Color picker
interface FolderColorPickerProps {
  selectedColor: FolderColorBackend;
  onColorChange: (color: FolderColorBackend) => void;
}

export function FolderColorPicker({
  selectedColor,
  onColorChange,
}: FolderColorPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {BACKEND_FOLDER_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorChange(color)}
          className={`p-1 rounded-lg border-2 transition-all hover:scale-110 ${
            selectedColor === color
              ? "border-gray-900 shadow-md"
              : "border-transparent"
          }`}
          title={color}
        >
          <FolderIcon color={color} size={32} />
        </button>
      ))}
    </div>
  );
}
