"use client";

import {
  ThumbsUp,
  Lightbulb,
  Rocket,
  User,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useFeatureRequests,
  useAdminUpdateFeatureStatus,
  type FeatureRequest,
} from "@/services/reportService";

const STATUS_MAP = {
  pending: { label: "Đang chờ", color: "bg-gray-100 text-gray-600" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-600" },
  deployed: { label: "Đã triển khai", color: "bg-green-100 text-green-700" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Đang chờ" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "deployed", label: "Đã triển khai" },
];

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <Rocket className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Chưa có đề xuất nào</p>
    </div>
  );
}

function RequestCard({
  request,
  onStatusChange,
  updating,
}: {
  request: FeatureRequest;
  onStatusChange: (id: number, status: string) => void;
  updating: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 shadow-sm">
      <div className="flex flex-col items-center gap-1 min-w-12 pt-1 text-gray-400">
        <ThumbsUp className="w-5 h-5" />
        <span className="text-sm font-semibold">{request.likes_count}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-gray-800">
            {request.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_MAP[request.status].color}`}
            >
              {STATUS_MAP[request.status].label}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-7 text-xs"
                  disabled={updating}
                >
                  Cập nhật <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {STATUS_OPTIONS.filter((s) => s.value !== request.status).map(
                  (s) => (
                    <DropdownMenuItem
                      key={s.value}
                      onClick={() => onStatusChange(request.id, s.value)}
                    >
                      {s.label}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          {request.description}
        </p>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
          <User className="w-3.5 h-3.5" />
          <span>{request.author_name}</span>
          <span>·</span>
          <span>
            {new Date(request.created_at).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>
    </div>
  );
}

function TabContent({
  list,
  loading,
  onStatusChange,
  updating,
}: {
  list: FeatureRequest[];
  loading?: boolean;
  onStatusChange: (id: number, status: string) => void;
  updating: boolean;
}) {
  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  if (!list.length) return <EmptyState />;
  return (
    <>
      {list.map((r) => (
        <RequestCard
          key={r.id}
          request={r}
          onStatusChange={onStatusChange}
          updating={updating}
        />
      ))}
    </>
  );
}

export default function AdminFeatureRequestsPage() {
  const { data: allData, isLoading } = useFeatureRequests();
  const { data: pendingData } = useFeatureRequests({ status: "pending" });
  const { data: confirmedData } = useFeatureRequests({ status: "confirmed" });
  const { data: deployedData } = useFeatureRequests({ status: "deployed" });
  const statusMutation = useAdminUpdateFeatureStatus();

  const handleStatusChange = (id: number, status: string) => {
    statusMutation.mutate({ id, status });
  };

  const all = allData?.data ?? [];
  const pending = pendingData?.data ?? [];
  const confirmed = confirmedData?.data ?? [];
  const deployed = deployedData?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Đề xuất chức năng
          </h2>
        </div>
        <p className="text-gray-500 text-sm">
          Xem và cập nhật trạng thái các đề xuất từ người dùng.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-5 w-full justify-start">
          <TabsTrigger value="all">
            Tất cả{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {all.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Đang chờ{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {pending.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Đã xác nhận{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {confirmed.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="deployed">
            Đã triển khai{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {deployed.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          <TabContent
            list={all}
            loading={isLoading}
            onStatusChange={handleStatusChange}
            updating={statusMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="pending" className="space-y-3">
          <TabContent
            list={pending}
            onStatusChange={handleStatusChange}
            updating={statusMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="confirmed" className="space-y-3">
          <TabContent
            list={confirmed}
            onStatusChange={handleStatusChange}
            updating={statusMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="deployed" className="space-y-3">
          <TabContent
            list={deployed}
            onStatusChange={handleStatusChange}
            updating={statusMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
