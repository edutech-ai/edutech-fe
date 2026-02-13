"use client";

import { FileText, MoreVertical, Edit, Copy, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/types/quiz";

interface QuizCardProps {
  quiz: Quiz;
  onView: (quizId: string) => void;
  onEdit?: (quizId: string) => void;
  onDuplicate?: (quizId: string) => void;
  onDelete?: (quizId: string) => void;
  isCloning?: boolean;
  isDeleting?: boolean;
}

export function QuizCard({
  quiz,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  isCloning = false,
  isDeleting = false,
}: QuizCardProps) {
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, { bg: string; icon: string }> = {
      "Toán học": { bg: "bg-blue-100", icon: "text-blue-600" },
      Toán: { bg: "bg-blue-100", icon: "text-blue-600" },
      "Ngữ văn": { bg: "bg-green-100", icon: "text-green-600" },
      Văn: { bg: "bg-green-100", icon: "text-green-600" },
      "Tiếng Anh": { bg: "bg-purple-100", icon: "text-purple-600" },
      Anh: { bg: "bg-purple-100", icon: "text-purple-600" },
      "Vật lý": { bg: "bg-orange-100", icon: "text-orange-600" },
      Lý: { bg: "bg-orange-100", icon: "text-orange-600" },
      "Hóa học": { bg: "bg-red-100", icon: "text-red-600" },
      Hóa: { bg: "bg-red-100", icon: "text-red-600" },
      "Sinh học": { bg: "bg-teal-100", icon: "text-teal-600" },
      Sinh: { bg: "bg-teal-100", icon: "text-teal-600" },
      "Lịch sử": { bg: "bg-yellow-100", icon: "text-yellow-600" },
      Sử: { bg: "bg-yellow-100", icon: "text-yellow-600" },
      "Địa lý": { bg: "bg-indigo-100", icon: "text-indigo-600" },
      Địa: { bg: "bg-indigo-100", icon: "text-indigo-600" },
    };
    return colors[subject] || { bg: "bg-gray-100", icon: "text-gray-600" };
  };

  const colors = getSubjectColor(quiz.subject);

  return (
    <div
      className="group relative rounded-lg border-2 border-transparent bg-white hover:bg-gray-50 p-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
      onClick={() => onView(quiz.id)}
    >
      {/* More Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-gray-200/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView(quiz.id);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(quiz.id);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(quiz.id);
                }}
                disabled={isCloning}
              >
                <Copy className="w-4 h-4 mr-2" />
                {isCloning ? "Đang sao chép..." : "Sao chép"}
              </DropdownMenuItem>
            )}
            {(onEdit || onDuplicate) && onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(quiz.id);
                }}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quiz Icon */}
      <div className="flex justify-center mb-1.5">
        <div
          className={cn(
            "w-11 h-11 rounded-lg flex items-center justify-center",
            colors.bg
          )}
        >
          <FileText className={cn("w-5 h-5", colors.icon)} />
        </div>
      </div>

      {/* Quiz Info */}
      <div className="space-y-0.5">
        <h3
          className="text-sm font-medium text-gray-900 text-center line-clamp-1 px-1s"
          title={quiz.title}
        >
          {quiz.title}
        </h3>

        <div className="flex items-center justify-center gap-1 text-[12px] text-gray-700">
          <span className="truncate max-w-15">{quiz.subject}</span>
          <span>•</span>
          <span>Lớp {quiz.grade}</span>
        </div>

        <div className="flex items-center justify-center gap-1 text-[12px] text-gray-700">
          <span>{quiz.total_questions} câu</span>
          <span>•</span>
          <span>{quiz.duration}p</span>
        </div>
      </div>
    </div>
  );
}
