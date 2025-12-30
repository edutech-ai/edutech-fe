"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MatrixBuilder } from "@/components/organisms/exam-matrix/MatrixBuilder";
import { CoreLoading } from "@/components/atoms/CoreLoading";
import { examMatrixMockService } from "@/services/mock";
import type { ExamMatrix } from "@/types";

export default function EditMatrixPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [matrix, setMatrix] = useState<ExamMatrix | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const data = await examMatrixMockService.getById(id);
        setMatrix(data);
      } catch (error) {
        console.error("Failed to fetch matrix:", error);
        // eslint-disable-next-line no-alert
        alert("Không tìm thấy ma trận");
        router.push("/dashboard/exam-matrix");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatrix();
  }, [id, router]);

  const handleSave = async (
    data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await examMatrixMockService.update(id, data);
      router.push("/dashboard/exam-matrix");
    } catch (error) {
      console.error("Failed to update matrix:", error);
      // eslint-disable-next-line no-alert
      alert("Có lỗi xảy ra khi cập nhật ma trận");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <CoreLoading message="Đang tải ma trận..." fullScreen />;
  }

  if (!matrix) {
    return null;
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
      />
    </div>
  );
}
