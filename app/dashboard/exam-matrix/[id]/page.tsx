"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { MatrixBuilder } from "@/components/organisms/exam-matrix/MatrixBuilder";
import { CoreLoading } from "@/components/atoms/CoreLoading";
import { useMatrixById, useUpdateMatrix } from "@/services/examMatrixService";
import type { ExamMatrix } from "@/types";

export default function EditMatrixPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: matrix, isLoading, error } = useMatrixById(id);
  const updateMatrix = useUpdateMatrix();

  const handleSave = (
    data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
  ) => {
    updateMatrix.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Cập nhật ma trận thành công");
          router.push("/dashboard/exam-matrix");
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi cập nhật ma trận");
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <CoreLoading message="Đang tải ma trận..." fullScreen />;
  }

  if (error || !matrix) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy ma trận</p>
        <button
          onClick={() => router.push("/dashboard/exam-matrix")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa ma trận</h1>
        <p className="text-gray-600 mt-1">Cập nhật thông tin ma trận đề thi</p>
      </div>

      <MatrixBuilder
        initialData={matrix}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={updateMatrix.isPending}
      />
    </div>
  );
}
