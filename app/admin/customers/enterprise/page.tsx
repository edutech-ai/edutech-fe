/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useEnterpriseCustomers,
  useCreateEnterpriseCustomer,
} from "@/services/adminService";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { SubscriptionPlan } from "@/services/settingsService";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  locked: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Hoạt động",
  locked: "Đã khoá",
  pending: "Chờ xác minh",
};

export default function EnterpriseCustomersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    plan_id: "",
  });

  const { data, isLoading } = useEnterpriseCustomers({
    search: debouncedSearch,
    page,
  });
  const { data: plansData } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        API_ENDPOINTS.SETTINGS.SUBSCRIPTION_PLANS
      );
      return res.data;
    },
  });
  const createMutation = useCreateEnterpriseCustomer();

  const customers = data?.data ?? [];
  const plans: SubscriptionPlan[] = plansData?.data ?? [];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout((window as any)._searchTimer);
    (window as any)._searchTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  const handleCreate = () => {
    if (!form.email || !form.password || !form.plan_id) {
      toast.error("Vui lòng điền đầy đủ email, mật khẩu và gói đăng ký");
      return;
    }
    createMutation.mutate(
      {
        email: form.email,
        password: form.password,
        name: form.name || undefined,
        plan_id: form.plan_id,
      },
      {
        onSuccess: () => {
          toast.success("Tạo khách hàng thành công");
          setModalOpen(false);
          setForm({ email: "", password: "", name: "", plan_id: "" });
        },

        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? "Lỗi khi tạo khách hàng");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Khách hàng Doanh nghiệp
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Giáo viên đang sử dụng gói đăng ký trả phí
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Tổng khách hàng</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {data?.total ?? "—"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Đang hoạt động</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {customers.filter((c) => c.status === "active").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Bị khoá</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {customers.filter((c) => c.status === "locked").length}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Chưa có khách hàng nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Gói đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Bài thi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lớp học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {c.name ?? "—"}
                      </p>
                      <p className="text-sm text-gray-500">{c.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {c.plan_name ?? "—"}
                      </p>
                      {c.plan_price != null && (
                        <p className="text-xs text-gray-500">
                          {c.plan_price.toLocaleString("vi-VN")}đ/tháng
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {c.quizzes_count}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {c.classrooms_count}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-1 text-xs font-medium",
                          STATUS_COLOR[c.status] ??
                            "bg-gray-50 text-gray-700 border-gray-200"
                        )}
                      >
                        {STATUS_LABEL[c.status] ?? c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/customers/${c.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Trang {data.page} / {data.totalPages} — {data.total} khách hàng
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={modalOpen}
        onOpenChange={(o) => {
          if (!o) setForm({ email: "", password: "", name: "", plan_id: "" });
          setModalOpen(o);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm khách hàng doanh nghiệp</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>
                Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Tên giáo viên hoặc tổ chức"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="email@truong.edu.vn"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Mật khẩu tạm thời"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Gói đăng ký <span className="text-red-500">*</span>
              </Label>
              <select
                value={form.plan_id}
                onChange={(e) =>
                  setForm((p) => ({ ...p, plan_id: e.target.value }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Chọn gói...</option>
                {plans.map((plan: any) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — {plan.price?.toLocaleString("vi-VN")}đ/tháng
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Tạo tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
