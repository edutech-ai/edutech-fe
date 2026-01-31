"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AIGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const aiOptions = [
  {
    id: "matrix",
    title: "Tạo theo Ma trận",
    description:
      "Tạo đề thi dựa trên ma trận đề thi chuẩn Bộ GD&ĐT, hoặc ma trận do thầy, cô thiết lập",
    image: "/images/quiz/matrix.svg",
    route: "/dashboard/quiz/matrix",
    disabled: true,
  },
  {
    id: "upload",
    title: "Tạo từ Tài liệu",
    description:
      "Tải lên tài liệu, giáo trình hoặc bài giảng để AI tạo đề thi dựa trên nội dung liên quan",
    image: "/images/quiz/upload.svg",
    route: "/dashboard/quiz/upload",
    disabled: true,
  },
  {
    id: "prompt",
    title: "Tạo theo Chủ đề",
    description:
      "Mô tả chủ đề, nội dung cần kiểm tra và AI sẽ tự động tạo đề thi phù hợp",
    image: "/images/quiz/prompt.svg",
    route: "/dashboard/quiz/prompt",
    disabled: false,
  },
];

export function AIGeneratorModal({
  open,
  onOpenChange,
}: AIGeneratorModalProps) {
  const router = useRouter();

  const handleSelect = (route: string) => {
    onOpenChange(false);
    router.push(route);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Chọn phương thức tạo bằng AI
          </DialogTitle>
          <DialogDescription>
            Chọn một trong các phương thức dưới đây để AI tạo đề thi tự động
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {aiOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => !option.disabled && handleSelect(option.route)}
              disabled={option.disabled}
              className={`group bg-white rounded-lg border-2 p-4 transition-all duration-200 text-left relative ${
                option.disabled
                  ? "border-gray-200 opacity-60 cursor-not-allowed"
                  : "border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {option.disabled && (
                <span className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                  Đang phát triển
                </span>
              )}
              <div className="flex flex-col h-full items-center">
                <div
                  className={`w-20 h-20 flex items-center justify-center mb-4 ${option.disabled ? "grayscale" : ""}`}
                >
                  <Image
                    src={option.image}
                    alt={option.title}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>

                <h3
                  className={`text-lg font-semibold mb-2 text-center ${option.disabled ? "text-gray-500" : "text-gray-900"}`}
                >
                  {option.title}
                </h3>

                <p
                  className={`text-xs leading-relaxed text-center ${option.disabled ? "text-gray-400" : "text-gray-600"}`}
                >
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
