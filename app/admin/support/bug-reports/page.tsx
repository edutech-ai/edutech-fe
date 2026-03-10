"use client";

import {
  AlertCircle,
  CheckCircle2,
  Wrench,
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
import Image from "next/image";
import {
  useBugReports,
  useAdminUpdateBugStatus,
  type BugReport,
} from "@/services/reportService";

const STATUS_MAP = {
  pending: {
    label: "Đang xem xét",
    color: "bg-orange-100 text-orange-600",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-600",
    icon: CheckCircle2,
  },
  fixed: {
    label: "Đã sửa",
    color: "bg-green-100 text-green-700",
    icon: Wrench,
  },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Đang xem xét" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "fixed", label: "Đã sửa" },
];

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Không có báo cáo nào</p>
    </div>
  );
}

function ReportCard({
  report,
  onStatusChange,
  updating,
}: {
  report: BugReport;
  onStatusChange: (id: number, status: string) => void;
  updating: boolean;
}) {
  const StatusIcon = STATUS_MAP[report.status].icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <h3 className="text-base font-semibold text-gray-800">
          {report.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_MAP[report.status].color}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {STATUS_MAP[report.status].label}
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
              {STATUS_OPTIONS.filter((s) => s.value !== report.status).map(
                (s) => (
                  <DropdownMenuItem
                    key={s.value}
                    onClick={() => onStatusChange(report.id, s.value)}
                  >
                    {s.label}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
        {report.description}
      </p>
      {report.attachments.length > 0 && (
        <div className="flex gap-2 mt-3">
          {report.attachments.map((url, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100"
            >
              <Image
                src={url}
                alt="attachment"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
        <User className="w-3.5 h-3.5" />
        <span>{report.author_name}</span>
        <span>·</span>
        <span>{new Date(report.created_at).toLocaleDateString("vi-VN")}</span>
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
  list: BugReport[];
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
        <ReportCard
          key={r.id}
          report={r}
          onStatusChange={onStatusChange}
          updating={updating}
        />
      ))}
    </>
  );
}

export default function AdminBugReportsPage() {
  const { data: allData, isLoading } = useBugReports();
  const { data: pendingData } = useBugReports({ status: "pending" });
  const { data: confirmedData } = useBugReports({ status: "confirmed" });
  const { data: fixedData } = useBugReports({ status: "fixed" });
  const statusMutation = useAdminUpdateBugStatus();

  const handleStatusChange = (id: number, status: string) => {
    statusMutation.mutate({ id, status });
  };

  const all = allData?.data ?? [];
  const pending = pendingData?.data ?? [];
  const confirmed = confirmedData?.data ?? [];
  const fixed = fixedData?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo lỗi</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Xem và cập nhật trạng thái các báo cáo lỗi từ người dùng.
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
            Đang xem xét{" "}
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
          <TabsTrigger value="fixed">
            Đã sửa{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {fixed.length}
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
        <TabsContent value="fixed" className="space-y-3">
          <TabContent
            list={fixed}
            onStatusChange={handleStatusChange}
            updating={statusMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
