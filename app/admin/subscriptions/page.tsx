/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  type SubscriptionPlan,
  type CreateSubscriptionPlanRequest,
} from "@/services/settingsService";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// Format VND currency without decimals
const formatCurrency = (value: number | string, currency: string = "VND") => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (currency === "VND") {
    return `${numValue.toLocaleString("vi-VN")}đ`;
  }
  return `${numValue.toLocaleString()} ${currency}`;
};

// Format storage display
const formatStorage = (mb: number) => {
  if (mb >= 1000) {
    return `${(mb / 1000).toFixed(mb % 1000 === 0 ? 0 : 1)}GB`;
  }
  return `${mb}MB`;
};

// Format limit display (-1 means unlimited)
const formatLimit = (value: number | null) => {
  if (value === null || value === -1) return "Không giới hạn";
  return value.toString();
};

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const [formData, setFormData] = useState<
    CreateSubscriptionPlanRequest & { isActive?: boolean }
  >({
    code: "",
    name: "",
    description: "",
    price: 0,
    currency: "VND",
    durationDays: 30,
    maxClasses: 5,
    maxQuizzesPerMonth: 10,
    maxStorageMb: 100,
    hasAdvancedAi: false,
    features: [],
    displayOrder: 0,
    isActive: true,
  });

  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const deleteMutation = useDeleteSubscriptionPlan();

  // Fetch pricing plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SETTINGS.SUBSCRIPTION_PLANS}?active=false`
      );
      // Parse price from string to number
      const parsedPlans = (response.data.data || []).map((plan: any) => ({
        ...plan,
        price:
          typeof plan.price === "string" ? parseFloat(plan.price) : plan.price,
      }));
      setPlans(parsedPlans);
    } catch (error) {
      toast.error("Không thể tải danh sách gói đăng ký");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle create/edit dialog
  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      const price =
        typeof plan.price === "string" ? parseFloat(plan.price) : plan.price;
      setFormData({
        code: plan.code,
        name: plan.name,
        currency: plan.currency || "VND",
        description: plan.description || "",
        price,
        durationDays: plan.durationDays,
        maxClasses: plan.maxClasses,
        maxQuizzesPerMonth: plan.maxQuizzesPerMonth,
        maxStorageMb: plan.maxStorageMb,
        hasAdvancedAi: plan.hasAdvancedAi,
        features: plan.features,
        displayOrder: plan.displayOrder,
        isActive: plan.isActive,
      });
      setBenefits(plan.features.length > 0 ? plan.features : [""]);
    } else {
      setEditingPlan(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        price: 0,
        currency: "VND",
        durationDays: 30,
        maxClasses: 5,
        maxQuizzesPerMonth: 10,
        maxStorageMb: 100,
        hasAdvancedAi: false,
        features: [],
        displayOrder: 0,
        isActive: true,
      });
      setBenefits([""]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      price: 0,
      currency: "VND",
      durationDays: 30,
      maxClasses: 5,
      maxQuizzesPerMonth: 10,
      maxStorageMb: 100,
      hasAdvancedAi: false,
      features: [],
      displayOrder: 0,
      isActive: true,
    });
    setBenefits([""]);
  };

  // Handle benefit changes
  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length > 1) {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!formData.code.trim()) {
      toast.error("Vui lòng nhập mã gói");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên gói");
      return;
    }

    const filteredFeatures = benefits.filter((b) => b.trim() !== "");

    const submitData = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      currency: formData.currency,
      durationDays: formData.durationDays,
      maxClasses: formData.maxClasses,
      maxQuizzesPerMonth: formData.maxQuizzesPerMonth,
      maxStorageMb: formData.maxStorageMb,
      hasAdvancedAi: formData.hasAdvancedAi,
      features: filteredFeatures,
      displayOrder: formData.displayOrder,
      ...(editingPlan && { isActive: formData.isActive }),
    };

    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({
          id: editingPlan.id,
          data: submitData,
        });
        toast.success("Cập nhật gói thành công");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Tạo gói thành công");
      }
      handleCloseDialog();
      fetchPlans();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại"
      );
    }
  };

  // Handle delete
  const handleDeleteClick = (id: string) => {
    setDeletingPlanId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlanId) return;

    try {
      await deleteMutation.mutateAsync(deletingPlanId);
      toast.success("Xóa gói thành công");
      fetchPlans();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa gói");
    } finally {
      setDeletingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Các gói đăng ký</h2>
          <p className="text-sm text-gray-600">
            Quản lý các gói đăng ký và tính năng tương ứng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-50"
              }
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-50"
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo gói mới
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="border rounded-lg overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-20">Mã</TableHead>
                <TableHead className="min-w-37.5">Tên gói</TableHead>
                <TableHead className="min-w-30">Giá</TableHead>
                <TableHead className="min-w-25">Thời hạn</TableHead>
                <TableHead className="min-w-25">Lớp học</TableHead>
                <TableHead className="min-w-25">Quiz/tháng</TableHead>
                <TableHead className="min-w-20">Lưu trữ</TableHead>
                <TableHead className="min-w-25">Trạng thái</TableHead>
                <TableHead className="min-w-20">Thứ tự</TableHead>
                <TableHead className="text-right min-w-25">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Chưa có gói đăng ký nào
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {plan.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="line-clamp-2">{plan.name}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {formatCurrency(plan.price, plan.currency)}
                      </span>
                    </TableCell>
                    <TableCell>{plan.durationDays} ngày</TableCell>
                    <TableCell>{formatLimit(plan.maxClasses)}</TableCell>
                    <TableCell>
                      {formatLimit(plan.maxQuizzesPerMonth)}
                    </TableCell>
                    <TableCell>
                      {plan.maxStorageMb
                        ? formatStorage(plan.maxStorageMb)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          plan.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {plan.isActive ? "Hoạt động" : "Ẩn"}
                      </span>
                    </TableCell>
                    <TableCell>{plan.displayOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Chưa có gói đăng ký nào
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-linear-to-br from-white to-gray-50 relative group"
              >
                <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(plan)}
                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(plan.id)}
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {plan.code}
                  </span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      plan.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {plan.isActive ? "Hoạt động" : "Ẩn"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                  {plan.description}
                </p>

                <div className="mb-4 py-4 border-y">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    / {plan.durationDays} ngày
                  </span>
                </div>

                {/* Plan limits */}
                <div className="space-y-1.5 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Lớp học:</span>
                    <span className="font-medium">
                      {formatLimit(plan.maxClasses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Quiz/tháng:</span>
                    <span className="font-medium">
                      {formatLimit(plan.maxQuizzesPerMonth)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Lưu trữ:</span>
                    <span className="font-medium">
                      {plan.maxStorageMb
                        ? formatStorage(plan.maxStorageMb)
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">AI nâng cao:</span>
                    <span
                      className={`font-medium ${
                        plan.hasAdvancedAi ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {plan.hasAdvancedAi ? "Có" : "Không"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-green-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <span className="text-xs text-gray-500 pl-7">
                      +{plan.features.length - 4} tính năng khác
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    Thứ tự: {plan.displayOrder}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Chỉnh sửa gói đăng ký" : "Tạo gói đăng ký mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết về gói đăng ký
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">
                  Mã gói <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="FREE, BASIC, PRO..."
                  className="font-mono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan_name">
                  Tên gói <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plan_name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Miễn phí, Cơ bản, Chuyên nghiệp..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Giáo viên mới bắt đầu..."
                rows={2}
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  min="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Đơn vị tiền</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currency: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VND"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration_days">Thời hạn (ngày)</Label>
                <Input
                  id="duration_days"
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationDays: Number(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max_classes">
                  Số lớp học tối đa
                  <span className="text-xs text-gray-500 ml-1">
                    (-1: không giới hạn)
                  </span>
                </Label>
                <Input
                  id="max_classes"
                  type="number"
                  value={formData.maxClasses ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxClasses: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  min="-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_quizzes">
                  Quiz/tháng
                  <span className="text-xs text-gray-500 ml-1">
                    (-1: không giới hạn)
                  </span>
                </Label>
                <Input
                  id="max_quizzes"
                  type="number"
                  value={formData.maxQuizzesPerMonth ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxQuizzesPerMonth: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  min="-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_storage">Lưu trữ (MB)</Label>
                <Input
                  id="max_storage"
                  type="number"
                  value={formData.maxStorageMb ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStorageMb: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  min="0"
                />
              </div>
            </div>

            {/* Display order & AI */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: Number(e.target.value),
                    })
                  }
                  min="0"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tùy chọn</Label>
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="has_advanced_ai"
                      checked={formData.hasAdvancedAi}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, hasAdvancedAi: checked })
                      }
                    />
                    <Label
                      htmlFor="has_advanced_ai"
                      className="font-normal cursor-pointer"
                    >
                      AI nâng cao
                    </Label>
                  </div>
                  {editingPlan && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="is_active"
                        checked={formData.isActive}
                        onCheckedChange={(checked: boolean) =>
                          setFormData({ ...formData, isActive: checked })
                        }
                      />
                      <Label
                        htmlFor="is_active"
                        className="font-normal cursor-pointer"
                      >
                        Hoạt động
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid gap-2">
              <Label>Danh sách tính năng</Label>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder="Nhập tính năng..."
                  />
                  {benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBenefit(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBenefit}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm tính năng
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {editingPlan ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa gói đăng ký"
        description="Bạn có chắc chắn muốn xóa gói đăng ký này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  );
}
