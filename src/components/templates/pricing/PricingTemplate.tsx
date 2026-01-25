"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useSubscriptionPlans,
  useCurrentSubscription,
} from "@/services/paymentService";
import { PricingCard } from "@/components/features/payment/PricingCard";
import { useUserStore } from "@/store/useUserStore";

export function PricingTemplate() {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => !!state.user);

  const { data: plansResponse, isLoading: isLoadingPlans } =
    useSubscriptionPlans();

  // Only fetch current subscription if authenticated
  const { data: subscriptionResponse, isLoading: isLoadingSubscription } =
    useCurrentSubscription(isAuthenticated);

  const plans = plansResponse?.data || [];
  const currentSubscription = isAuthenticated
    ? subscriptionResponse?.data
    : null;

  const handleLoginRequired = () => {
    // Redirect to login with return URL
    router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
  };

  if (isLoadingPlans || (isAuthenticated && isLoadingSubscription)) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pricing Cards */}
      {plans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentSubscription?.planId === plan.id}
              isPopular={plan.code === "PRO"}
              isAuthenticated={isAuthenticated}
              onLoginRequired={handleLoginRequired}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có gói dịch vụ nào.</p>
        </div>
      )}
    </div>
  );
}
