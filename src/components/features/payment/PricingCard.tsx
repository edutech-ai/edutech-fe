"use client";

import { useRouter } from "next/navigation";
import { Check, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/services/paymentService";
import { formatPrice } from "@/services/paymentService";

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onLoginRequired?: () => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
}

export function PricingCard({
  plan,
  isCurrentPlan = false,
  isPopular = false,
  onLoginRequired,
  isLoading = false,
  isAuthenticated = false,
}: PricingCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!isAuthenticated && plan.price > 0) {
      onLoginRequired?.();
      return;
    }
    // Redirect to checkout page
    router.push(`/checkout?planCode=${plan.code}`);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-md border-2 bg-white p-6 transition-colors duration-200 cursor-pointer",
        isPopular
          ? "border-primary bg-blue-50/30"
          : isCurrentPlan
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-blue-300"
      )}
      onClick={
        plan.code === "ENTERPRISE"
          ? () => window.open("https://www.facebook.com/aiedutechvn", "_blank")
          : !isCurrentPlan && plan.price > 0
            ? handleClick
            : undefined
      }
    >
      {/* Popular badge */}
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white">
            Đề xuất
          </span>
        </div>
      )}

      {/* Current plan badge if has */}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-1.5 text-sm font-semibold text-white">
            <Check className="h-4 w-4" />
            Gói hiện tại
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-4 pt-2">
        <h3
          className={cn(
            "text-xl font-bold",
            isPopular ? "text-primary" : "text-gray-900"
          )}
        >
          {plan.name}
        </h3>
        {plan.description && (
          <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-4xl font-bold",
              isPopular ? "text-primary" : "text-gray-900"
            )}
          >
            {plan.price === 0 ? "Miễn phí" : formatPrice(plan.price)}
          </span>
          {plan.price > 0 && (
            <span className="text-gray-800 text-sm">
              /{plan.durationDays} ngày
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-6" />

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-3">
        {plan.maxClasses && (
          <li className="flex items-start gap-3">
            <div
              className={cn(
                "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                isPopular ? "bg-primary-100" : "bg-green-100"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  isPopular ? "text-primary" : "text-green-600"
                )}
              />
            </div>
            <span className="text-sm text-gray-700">
              Tối đa <strong>{plan.maxClasses}</strong> lớp học
            </span>
          </li>
        )}
        {plan.maxQuizzesPerMonth && (
          <li className="flex items-start gap-3">
            <div
              className={cn(
                "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                isPopular ? "bg-primary-100" : "bg-green-100"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  isPopular ? "text-primary" : "text-green-600"
                )}
              />
            </div>
            <span className="text-sm text-gray-700">
              <strong>{plan.maxQuizzesPerMonth}</strong> đề thi/tháng
            </span>
          </li>
        )}
        {plan.maxStorageMb && (
          <li className="flex items-start gap-3">
            <div
              className={cn(
                "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                isPopular ? "bg-primary-100" : "bg-green-100"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  isPopular ? "text-primary" : "text-green-600"
                )}
              />
            </div>
            <span className="text-sm text-gray-700">
              <strong>
                {plan.maxStorageMb >= 1024
                  ? `${(plan.maxStorageMb / 1024).toFixed(0)} GB`
                  : `${plan.maxStorageMb} MB`}
              </strong>{" "}
              lưu trữ
            </span>
          </li>
        )}
        {plan.hasAdvancedAi && (
          <li className="flex items-start gap-3">
            <div
              className={cn(
                "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                isPopular ? "bg-primary-100" : "bg-green-100"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  isPopular ? "text-primary" : "text-green-600"
                )}
              />
            </div>
            <span className="text-sm text-gray-700">
              <strong>AI nâng cao</strong> tạo đề thi
            </span>
          </li>
        )}
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={cn(
                "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                isPopular ? "bg-primary-100" : "bg-green-100"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  isPopular ? "text-primary" : "text-green-600"
                )}
              />
            </div>
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className={cn(
          "w-full h-12 text-base font-semibold transition-colors duration-200",
          plan.code === "ENTERPRISE"
            ? "bg-violet-600 hover:bg-violet-700 text-white"
            : isPopular
              ? "bg-primary text-white"
              : isCurrentPlan
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-600 hover:bg-blue-700 text-white"
        )}
        variant={isCurrentPlan ? "outline" : "default"}
        onClick={(e) => {
          e.stopPropagation();
          if (plan.code === "ENTERPRISE") {
            window.open("https://www.facebook.com/aiedutechvn", "_blank");
            return;
          }
          handleClick();
        }}
        disabled={isCurrentPlan || isLoading || plan.price === 0}
      >
        {plan.code === "ENTERPRISE" ? (
          <>
            <MessageCircle className="w-4 h-4 mr-2" />
            Liên hệ chúng tôi
          </>
        ) : isCurrentPlan ? (
          "Đang sử dụng"
        ) : plan.price === 0 ? (
          "Gói mặc định"
        ) : !isAuthenticated ? (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Đăng nhập để mua
          </>
        ) : (
          "Chọn gói này"
        )}
      </Button>
    </div>
  );
}
