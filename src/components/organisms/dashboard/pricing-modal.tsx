"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Crown, Sparkles, Loader2 } from "lucide-react";
import {
  useSubscriptionPlans,
  formatPrice,
  type SubscriptionPlan,
} from "@/services/paymentService";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const planIcons: Record<string, typeof Sparkles> = {
  BASIC: Sparkles,
  PRO: Crown,
};

const planColors: Record<string, string> = {
  BASIC: "blue",
  PRO: "purple",
};

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const { data: plansResponse, isLoading } = useSubscriptionPlans();

  // Filter only BASIC and PRO plans
  const plans = (plansResponse?.data || []).filter(
    (plan) => plan.code === "BASIC" || plan.code === "PRO"
  );

  const handlePurchase = (plan: SubscriptionPlan) => {
    onClose();
    // Redirect to checkout page
    router.push(`/checkout?planCode=${plan.code}`);
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        ) : plans.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {plans.map((plan) => {
              const Icon = planIcons[plan.code] || Sparkles;
              const color = planColors[plan.code] || "blue";
              const isPopular = plan.code === "PRO";

              return (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-lg p-6 ${
                    isPopular ? "border-primary shadow-lg" : "border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Phổ biến nhất
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        color === "blue" ? "bg-blue-100" : "bg-purple-100"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          color === "blue" ? "text-blue-600" : "text-primary"
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {plan.description}
                      </p>
                    )}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-600">
                        /{plan.durationDays} ngày
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.maxClasses && (
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          Tối đa {plan.maxClasses} lớp học
                        </span>
                      </li>
                    )}
                    {plan.maxQuizzesPerMonth && (
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          {plan.maxQuizzesPerMonth} đề thi/tháng
                        </span>
                      </li>
                    )}
                    {plan.maxStorageMb && (
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          {plan.maxStorageMb >= 1024
                            ? `${(plan.maxStorageMb / 1024).toFixed(0)} GB`
                            : `${plan.maxStorageMb} MB`}{" "}
                          lưu trữ
                        </span>
                      </li>
                    )}
                    {plan.hasAdvancedAi && (
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          AI nâng cao
                        </span>
                      </li>
                    )}
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(plan)}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isPopular
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
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có gói dịch vụ nào.</p>
          </div>
        )}

        <div className="mt-6 text-center text-md text-primary">
          <p>Thanh toán an toàn • Hoàn tiền trong 7 ngày • Hỗ trợ 24/7</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
