"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, HelpCircle, Award, User, Eye } from "lucide-react";
import type { Quiz } from "@/types";

const SUBJECT_BG: Record<string, string> = {
  Toán: "/images/background/bg_math.svg",
  "Toán học": "/images/background/bg_math.svg",
  Math: "/images/background/bg_math.svg",
  "Tiếng Anh": "/images/background/bg_english.svg",
  English: "/images/background/bg_english.svg",
  "Ngữ văn": "/images/background/bg_literature.svg",
  "Văn học": "/images/background/bg_literature.svg",
  Literature: "/images/background/bg_literature.svg",
};

const DEFAULT_BG = "/images/background/bg_math.svg";

function getSubjectBg(subject?: string): string {
  if (!subject) return DEFAULT_BG;
  return SUBJECT_BG[subject] ?? DEFAULT_BG;
}

interface ExploreQuizCardProps {
  quiz: Quiz & {
    teacher_email?: string;
    teacher_name?: string;
    view_count?: number;
  };
}

export function ExploreQuizCard({ quiz }: ExploreQuizCardProps) {
  const bgSrc = getSubjectBg(quiz.subject);
  const date = new Date(quiz.created_at).toLocaleDateString("vi-VN");

  return (
    <Link
      href={`/explore/${quiz.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="h-36 relative bg-blue-50 overflow-hidden flex items-center justify-center">
        <Image src={bgSrc} alt="" fill className="object-contain p-3" />
        {quiz.subject && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
            {quiz.subject}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors min-h-10">
          {quiz.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            {quiz.total_questions}
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-blue-500" />
            {quiz.duration} phút
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            {quiz.view_count ?? 0}
          </span>
        </div>

        {(quiz.teacher_name || quiz.teacher_email) && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-3 h-3 text-gray-500" />
            </div>
            <span className="truncate">
              {quiz.teacher_name || quiz.teacher_email}
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg group-hover:bg-blue-700 transition">
          <span>Xem đề thi</span>
        </div>
      </div>
    </Link>
  );
}
