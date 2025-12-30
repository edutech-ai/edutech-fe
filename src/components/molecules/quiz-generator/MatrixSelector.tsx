"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { examMatrixMockService } from "@/services/mock";
import type { ExamMatrix } from "@/types";

interface MatrixSelectorProps {
  selectedMatrixId?: string;
  onSelect: (matrix: ExamMatrix | null) => void;
  subject?: string;
  grade?: number;
}

export function MatrixSelector({
  selectedMatrixId,
  onSelect,
  subject,
  grade,
}: MatrixSelectorProps) {
  const [matrices, setMatrices] = useState<ExamMatrix[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMatrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, grade]);

  const fetchMatrices = async () => {
    setIsLoading(true);
    try {
      const filters: { subject?: string; grade?: number } = {};
      if (subject) filters.subject = subject;
      if (grade) filters.grade = grade;

      const data = await examMatrixMockService.getAll(filters);
      setMatrices(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (matrixId: string) => {
    const matrix = matrices.find((m) => m.id === matrixId);
    onSelect(matrix || null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Chọn ma trận có sẵn
        </label>
        <Link
          href="/dashboard/exam-matrix/new"
          target="_blank"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Tạo ma trận mới
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Đang tải...</div>
      ) : matrices.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">
            Chưa có ma trận nào phù hợp với môn học và lớp đã chọn
          </p>
          <Link
            href="/dashboard/exam-matrix/new"
            target="_blank"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Tạo ma trận mới
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {matrices.map((matrix) => (
            <label
              key={matrix.id}
              className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                selectedMatrixId === matrix.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <input
                type="radio"
                name="matrix"
                value={matrix.id}
                checked={selectedMatrixId === matrix.id}
                onChange={() => handleSelect(matrix.id)}
                className="sr-only"
              />
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {matrix.name}
                    </h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {matrix.subject}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      Lớp {matrix.grade}
                    </span>
                  </div>
                  {matrix.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {matrix.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{matrix.chapters.length} chương</span>
                    <span>{matrix.totalQuestions} câu</span>
                    <span>{matrix.totalPoints} điểm</span>
                  </div>
                </div>
                {selectedMatrixId === matrix.id && (
                  <div className="ml-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
