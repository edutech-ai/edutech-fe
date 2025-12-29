"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockSubscriptionPlans } from "@/data/admin/mockSubscriptions";
import { Check, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Subscription Plans
          </h2>
          <p className="text-gray-600">
            Manage pricing tiers and plan features
          </p>
        </div>
        <Button>Create New Plan</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockSubscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative p-6",
              plan.isPopular && "border-2 border-blue-500"
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-500">/{plan.billingPeriod}</span>
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="text-sm font-medium text-gray-600">
                  {plan.maxUsers === 999999 ? "Unlimited" : plan.maxUsers}{" "}
                  {plan.maxUsers === 1 ? "user" : "users"}
                </p>
                <p className="text-sm text-gray-600">
                  {plan.maxExamsPerMonth === "unlimited"
                    ? "Unlimited exams"
                    : `${plan.maxExamsPerMonth} exams/month`}
                </p>
              </div>

              <div className="mt-6 space-y-2 border-t pt-4">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span className="text-left text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <p className="text-sm text-gray-500">
                    +{plan.features.length - 4} more features
                  </p>
                )}
              </div>

              <Button variant="outline" className="mt-6 w-full" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Plan
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
