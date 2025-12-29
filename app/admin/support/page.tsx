import { Card } from "@/components/ui/card";
import { HeadphonesIcon } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Support</h2>
        <p className="text-gray-600">Manage support tickets and inquiries</p>
      </div>

      <Card className="flex h-96 items-center justify-center">
        <div className="text-center">
          <HeadphonesIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Coming Soon
          </h3>
          <p className="mt-2 text-gray-500">
            Support ticket system is under development
          </p>
        </div>
      </Card>
    </div>
  );
}
