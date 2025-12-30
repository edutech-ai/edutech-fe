"use client";

import { useRouter } from "next/navigation";
import { MatrixBuilder } from "@/components/organisms/exam-matrix/MatrixBuilder";
import { examMatrixMockService } from "@/services/mock";
import type { ExamMatrix } from "@/types";

export default function NewMatrixPage() {
  const router = useRouter();

  const handleSave = async (
    data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await examMatrixMockService.create(data);
      router.push("/dashboard/exam-matrix");
    } catch (error) {
      console.error("Failed to create matrix:", error);
      // eslint-disable-next-line no-alert
      alert("Có lỗi xảy ra khi tạo ma trận");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tạo ma trận mới</h1>
        <p className="text-gray-600 mt-1">
          Xây dựng ma trận đề thi theo chuẩn Bộ GD&ĐT
        </p>
      </div>

      <MatrixBuilder onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
