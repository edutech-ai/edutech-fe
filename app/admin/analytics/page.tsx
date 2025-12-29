import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics & Reports
        </h2>
        <p className="text-gray-600">Detailed analytics and usage statistics</p>
      </div>

      <Card className="flex h-96 items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Coming Soon
          </h3>
          <p className="mt-2 text-gray-500">
            Advanced analytics features are under development
          </p>
        </div>
      </Card>
    </div>
  );
}
