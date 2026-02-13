import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage all users across the platform</p>
      </div>

      <Card className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Coming Soon
          </h3>
          <p className="mt-2 text-gray-500">
            User management features are under development
          </p>
        </div>
      </Card>
    </div>
  );
}
