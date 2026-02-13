"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AIGeneratorModal } from "@/components/organisms/quiz/AIGeneratorModal";
import { toast } from "sonner";
import Image from "next/image";

export default function QuizPage() {
  const router = useRouter();
  const [showAIModal, setShowAIModal] = useState(false);

  const handleManualCreate = () => {
    router.push("/dashboard/quiz/new?type=MANUAL");
  };

  const handleImportExcel = () => {
    toast.info("Tính năng đang phát triển");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={handleManualCreate}
          className="group bg-white rounded-xl border-2 border-blue-200 p-6 transition-all duration-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 text-left"
        >
          <div className="flex flex-col h-full">
            <Image
              src="/images/quiz/quiz_op3.svg"
              alt="Manual Creation"
              width={48}
              height={48}
              className="mb-4 md:w-24 md:h-24"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tạo thủ công
            </h3>
            <p className="text-gray-600 text-sm mb-4 flex-1">
              Tự tạo từng câu hỏi và tùy chỉnh hoàn toàn theo ý bạn. Kiểm soát
              toàn bộ nội dung đề thi.
            </p>

            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Kiểm soát hoàn toàn nội dung
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Nhiều loại câu hỏi đa dạng
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Sắp xếp câu hỏi linh hoạt
              </li>
            </ul>

            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              Bắt đầu tạo
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowAIModal(true)}
          className="group bg-white rounded-xl border-2 border-blue-200 p-6 transition-all duration-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 text-left"
        >
          <div className="flex flex-col h-full">
            <Image
              src="/images/quiz/quiz_op1.svg"
              alt="AI Generation"
              width={48}
              height={48}
              className="mb-4 md:w-24 md:h-24"
            />

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tạo bằng AI
            </h3>
            <p className="text-gray-600 text-sm mb-4 flex-1">
              Để AI tự động tạo đề thi dựa trên ma trận, tài liệu hoặc chủ đề.
              Nhanh chóng và hiệu quả.
            </p>

            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Tạo nhanh từ ma trận
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Upload tài liệu để tạo
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Mô tả chủ đề để AI tạo
              </li>
            </ul>

            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              Chọn phương thức AI
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        <button
          onClick={handleImportExcel}
          className="group bg-white rounded-xl border-2 border-blue-200 p-6 transition-all duration-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 text-left"
        >
          <div className="flex flex-col h-full">
            <Image
              src="/images/quiz/quiz_op2.svg"
              alt="Import Excel"
              width={48}
              height={48}
              className="mb-4 md:w-24 md:h-24"
            />

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tải lên đề thi
            </h3>
            <p className="text-gray-600 text-sm mb-4 flex-1">
              Tải lên file chứa chứa danh sách câu hỏi để import nhanh chóng vào
              hệ thống.
            </p>

            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Upload file chứa câu hỏi
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Kiểm tra đáp án thủ công sau
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mr-2" />
                Thêm hình ảnh sau nếu cần
              </li>
            </ul>

            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              Tải lên file
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">
          Lưu ý về Import File
        </h3>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>• Đáp án đúng cần được kiểm tra thủ công sau khi import</li>
          <li>• Hình ảnh có thể được thêm vào sau</li>
          <li>• Quá trình phân tích có thể mất một khoảng thời gian</li>
          <li>
            • Nâng cấp gói để tăng giới hạn kích thước file và số lượng câu hỏi
          </li>
        </ul>
      </div>

      <AIGeneratorModal open={showAIModal} onOpenChange={setShowAIModal} />
    </div>
  );
}
