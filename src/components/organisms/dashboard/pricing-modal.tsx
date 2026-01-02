"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Crown, Sparkles } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: "monthly",
    name: "Gói Tháng Cơ Bản",
    price: "39,000",
    period: "tháng",
    description: "Phù hợp cho giáo viên cần linh hoạt",
    features: [
      "Tạo không giới hạn đề thi với AI",
      "Tạo không giới hạn giáo án",
      "Ma trận đề thi tự động",
      "Xuất file PDF/Word",
      "Thư viện học liệu đầy đủ",
      "Hỗ trợ ưu tiên 24/7",
    ],
    icon: Sparkles,
    color: "blue",
    popular: false,
  },
  {
    id: "yearly",
    name: "Gói Tháng Nâng Cao",
    price: "100,000",
    period: "năm",
    description: "Tiết kiệm 17% - Lựa chọn tốt nhất",
    features: [
      "Tất cả tính năng gói Tháng Cơ Bản",
      "AI phân tích học sinh nâng cao",
      "Tạo bài giảng tương tác",
      "Kho câu hỏi Premium",
      "Đào tạo sử dụng miễn phí",
    ],
    icon: Crown,
    color: "purple",
    popular: true,
  },
];

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const handlePurchase = (planId: string) => {
    // TODO: Implement payment logic
    // eslint-disable-next-line no-console
    console.log("Purchasing plan:", planId);
    // For now, just close the modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Chọn gói phù hợp với bạn
          </DialogTitle>
          <DialogDescription className="text-center">
            Nâng cấp ngay để trải nghiệm đầy đủ sức mạnh của AI trong giảng dạy
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative border-2 rounded-lg p-6 ${
                  plan.popular ? "border-primary shadow-lg" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Phổ biến nhất
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.color === "blue" ? "bg-blue-100" : "bg-purple-100"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        plan.color === "blue" ? "text-blue-600" : "text-primary"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">đ/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Chọn gói này
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-md text-primary">
          <p>Thanh toán an toàn • Hoàn tiền trong 7 ngày • Hỗ trợ 24/7</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
