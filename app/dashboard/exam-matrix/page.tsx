"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Copy, Edit, Trash2 } from "lucide-react";
import { CoreLoading } from "@/components/atoms/CoreLoading";
import {
  useMyMatrices,
  useDeleteMatrix,
  useDuplicateMatrix,
} from "@/services/examMatrixService";
import { SUBJECTS, GRADES } from "@/types";
import type { ExamMatrixQueryParams } from "@/types";

export default function ExamMatrixPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<number | "">("");

  const filters: ExamMatrixQueryParams = {
    ...(selectedSubject && { subject: selectedSubject }),
    ...(selectedGrade && { grade: Number(selectedGrade) }),
    ...(searchQuery && { search: searchQuery }),
  };

  const { data: matrices = [], isLoading } = useMyMatrices(filters);
  const deleteMatrix = useDeleteMatrix();
  const duplicateMatrix = useDuplicateMatrix();

  const handleDuplicate = (id: string) => {
    duplicateMatrix.mutate(id);
  };

  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-alert
    if (!confirm("Bạn có chắc chắn muốn xóa ma trận này?")) return;
    deleteMatrix.mutate(id);
  };

  if (isLoading) {
    return <CoreLoading message="Đang tải ma trận..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Ma trận đề thi
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý ma trận để sử dụng cho các đề thi
          </p>
        </div>
        <Link
          href="/dashboard/exam-matrix/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo ma trận mới
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm ma trận..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả môn học</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) =>
                setSelectedGrade(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả lớp</option>
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  Lớp {grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matrix List */}
      {matrices.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Image
            src="/images/empty/empty_matrix.svg"
            alt="Chưa có ma trận"
            width={160}
            height={120}
            className="mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có ma trận nào
          </h3>
          <p className="text-gray-600 mb-4">
            Tạo ma trận đầu tiên để bắt đầu tạo đề thi theo chuẩn
          </p>
          <Link
            href="/dashboard/exam-matrix/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Tạo ma trận mới
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {matrices.map((matrix) => (
            <div
              key={matrix.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {matrix.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {matrix.subject}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      Lớp {matrix.grade}
                    </span>
                  </div>
                  {matrix.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {matrix.description}
                    </p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>{matrix.totalChapters} chương</span>
                    <span>{matrix.totalQuestions} câu hỏi</span>
                    <span>{matrix.totalPoints} điểm</span>
                    <span>
                      Cập nhật:{" "}
                      {new Date(matrix.updatedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/exam-matrix/${matrix.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(matrix.id)}
                    disabled={duplicateMatrix.isPending}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                    title="Sao chép"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(matrix.id)}
                    disabled={deleteMatrix.isPending}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
