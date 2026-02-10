"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MatrixBuilder } from "@/components/organisms/exam-matrix/MatrixBuilder";
import { useCreateMatrix } from "@/services/examMatrixService";
import type { ExamMatrix } from "@/types";

export default function NewMatrixPage() {
  const router = useRouter();
  const createMatrix = useCreateMatrix();

  const handleSave = (
    data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
  ) => {
    createMatrix.mutate(data, {
      onSuccess: () => {
        toast.success("Tạo ma trận thành công");
        router.push("/dashboard/exam-matrix");
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi tạo ma trận");
      },
    });
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

      <MatrixBuilder
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={createMatrix.isPending}
      />
    </div>
  );
}
