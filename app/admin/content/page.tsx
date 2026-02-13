import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        <p className="text-gray-600">
          View and manage exams created across the platform
        </p>
      </div>

      <Card className="flex h-96 items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Coming Soon
          </h3>
          <p className="mt-2 text-gray-500">
            Content management features are under development
          </p>
        </div>
      </Card>
    </div>
  );
}
