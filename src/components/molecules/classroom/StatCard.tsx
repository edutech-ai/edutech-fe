"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className={cn("bg-white", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold text-blue-600",
                valueClassName
              )}
            >
              {value}
            </p>
            {trend && (
              <p
                className={cn(
                  "mt-1 text-xs",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
