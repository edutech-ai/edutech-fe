import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure platform-wide settings</p>
      </div>

      <Card className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Settings className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Coming Soon
          </h3>
          <p className="mt-2 text-gray-500">
            Settings management is under development
          </p>
        </div>
      </Card>
    </div>
  );
}
