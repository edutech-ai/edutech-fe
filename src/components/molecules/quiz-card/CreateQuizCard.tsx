"use client";

import { Plus } from "lucide-react";

interface CreateQuizCardProps {
  onCreate: () => void;
}

export function CreateQuizCard({ onCreate }: CreateQuizCardProps) {
  return (
    <div
      className="group relative rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 p-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
      onClick={onCreate}
    >
      {/* Plus Icon */}
      <div className="flex justify-center mb-1.5">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-colors">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Create Text */}
      <div className="space-y-0.5">
        <h3 className="text-xs font-medium text-gray-900 text-center px-1 min-h-[2rem] leading-tight flex items-center justify-center">
          Tạo đề thi mới
        </h3>

        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500">
          <span>Click để bắt đầu</span>
        </div>
      </div>
    </div>
  );
}
