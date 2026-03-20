"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useCustomerDetail,
  useToggleLockCustomer,
} from "@/services/adminService";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  locked: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Đang hoạt động",
  locked: "Đã khoá",
  pending: "Chờ xác minh",
};

export default function CustomerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [confirmLock, setConfirmLock] = useState(false);

  const { data: customer, isLoading } = useCustomerDetail(id);
  const lockMutation = useToggleLockCustomer();

  const handleToggleLock = () => {
    lockMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.message);
        setConfirmLock(false);
      },
      onError: () => toast.error("Lỗi khi thực hiện thao tác"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            Không tìm thấy khách hàng
          </p>
          <Link href="/admin/customers/enterprise">
            <Button className="mt-4">Quay lại</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = customer.status === "locked";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers/enterprise">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {customer.name ?? customer.email}
            </h2>
            <p className="text-gray-500 text-sm">Chi tiết khách hàng</p>
          </div>
        </div>
        <Button
          variant={isLocked ? "outline" : "destructive"}
          onClick={() => setConfirmLock(true)}
        >
          {isLocked ? (
            <>
              <Unlock className="mr-2 h-4 w-4" />
              Mở khoá
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Khoá tài khoản
            </>
          )}
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gói đăng ký</p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                {customer.plan_name ?? "Chưa có"}
              </p>
              {customer.plan_price != null && (
                <p className="text-xs text-gray-400 mt-1">
                  {customer.plan_price.toLocaleString("vi-VN")}đ/tháng
                </p>
              )}
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bài thi đã tạo</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {customer.quizzes_count}
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lớp học</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {customer.classrooms_count}
              </p>
              {customer.students_count != null && (
                <p className="text-xs text-gray-400 mt-1">
                  {customer.students_count} học sinh
                </p>
              )}
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <span
                className={cn(
                  "mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium",
                  STATUS_COLOR[customer.status] ??
                    "bg-gray-50 text-gray-700 border-gray-200"
                )}
              >
                {STATUS_LABEL[customer.status] ?? customer.status}
              </span>
            </div>
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Info */}
      <Card className="p-6 max-w-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Thông tin tài khoản
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{customer.email}</p>
            </div>
          </div>

          {customer.address && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium text-gray-900">{customer.address}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="mt-1 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Ngày tham gia</p>
              <p className="font-medium text-gray-900">
                {new Date(customer.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {customer.subscription_status === "active" && customer.end_date && (
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Hạn đăng ký</p>
                <p className="font-medium text-gray-900">
                  {new Date(customer.end_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={confirmLock} onOpenChange={setConfirmLock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isLocked ? "Mở khoá tài khoản này?" : "Khoá tài khoản này?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isLocked
                ? "Người dùng sẽ có thể đăng nhập và sử dụng hệ thống trở lại."
                : "Người dùng sẽ không thể đăng nhập cho đến khi được mở khoá."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleLock}
              className={isLocked ? "" : "bg-red-500 hover:bg-red-600"}
            >
              {lockMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLocked ? (
                "Mở khoá"
              ) : (
                "Khoá tài khoản"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
