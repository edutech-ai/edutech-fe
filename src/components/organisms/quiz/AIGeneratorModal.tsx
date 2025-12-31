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
  },
  {
    id: "upload",
    title: "Tạo từ Tài liệu",
    description:
      "Tải lên tài liệu, giáo trình hoặc bài giảng để AI tạo đề thi dựa trên nội dung liên quan",
    image: "/images/quiz/upload.svg",
    route: "/dashboard/quiz/upload",
  },
  {
    id: "prompt",
    title: "Tạo theo Chủ đề",
    description:
      "Mô tả chủ đề, nội dung cần kiểm tra và AI sẽ tự động tạo đề thi phù hợp",
    image: "/images/quiz/prompt.svg",
    route: "/dashboard/quiz/prompt",
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
              onClick={() => handleSelect(option.route)}
              className="group bg-white rounded-lg border-2 border-blue-200 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 text-left"
            >
              <div className="flex flex-col h-full items-center">
                <div className="w-20 h-20 flex items-center justify-center mb-4">
                  <Image
                    src={option.image}
                    alt={option.title}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {option.title}
                </h3>

                <p className="text-gray-600 text-xs leading-relaxed text-center">
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
