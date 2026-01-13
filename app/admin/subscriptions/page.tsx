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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreatePricingPlan,
  useUpdatePricingPlan,
  useDeletePricingPlan,
  type PricePlan,
  type CreatePricePlanRequest,
} from "@/services/settingsService";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<PricePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricePlan | null>(null);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePricePlanRequest>({
    plan_name: "",
    description: "",
    price: 0,
    discount_percent: 0,
    billing_type: "monthly",
    button_text: "Đăng ký",
    benefits: [],
    display_order: 0,
  });

  const createMutation = useCreatePricingPlan();
  const updateMutation = useUpdatePricingPlan();
  const deleteMutation = useDeletePricingPlan();

  // Fetch pricing plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SETTINGS.PRICE_PLANS}?active=false`
      );
      setPlans(response.data.data || []);
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
  const handleOpenDialog = (plan?: PricePlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        plan_name: plan.plan_name,
        description: plan.description,
        price: plan.price,
        discount_percent: plan.discount_percent,
        billing_type: plan.billing_type,
        button_text: plan.button_text,
        benefits: plan.benefits,
        display_order: plan.display_order,
      });
      setBenefits(plan.benefits.length > 0 ? plan.benefits : [""]);
    } else {
      setEditingPlan(null);
      setFormData({
        plan_name: "",
        description: "",
        price: 0,
        discount_percent: 0,
        billing_type: "monthly",
        button_text: "Đăng ký",
        benefits: [],
        display_order: 0,
      });
      setBenefits([""]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
    setFormData({
      plan_name: "",
      description: "",
      price: 0,
      discount_percent: 0,
      billing_type: "monthly",
      button_text: "Đăng ký",
      benefits: [],
      display_order: 0,
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
    if (!formData.plan_name.trim()) {
      toast.error("Vui lòng nhập tên gói");
      return;
    }

    const filteredBenefits = benefits.filter((b) => b.trim() !== "");

    const submitData = {
      ...formData,
      benefits: filteredBenefits,
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

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
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
                <TableHead className="min-w-37.5">Tên gói</TableHead>
                <TableHead className="min-w-50">Mô tả</TableHead>
                <TableHead className="min-w-30">Giá</TableHead>
                <TableHead className="min-w-25">Giảm giá</TableHead>
                <TableHead className="min-w-20">Loại</TableHead>
                <TableHead className="min-w-25">Trạng thái</TableHead>
                <TableHead className="min-w-20">Thứ tự</TableHead>
                <TableHead className="text-right min-w-25">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Chưa có gói đăng ký nào
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      <div className="line-clamp-2">{plan.plan_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="line-clamp-2">{plan.description}</div>
                    </TableCell>
                    <TableCell>
                      {plan.discount_percent > 0 ? (
                        <div>
                          <span className="line-through text-gray-500 text-sm">
                            {plan.price.toLocaleString()}đ
                          </span>
                          <br />
                          <span className="font-semibold text-green-600">
                            {calculateDiscountedPrice(
                              plan.price,
                              plan.discount_percent
                            ).toLocaleString()}
                            đ
                          </span>
                        </div>
                      ) : (
                        <span>{plan.price.toLocaleString()}đ</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {plan.discount_percent > 0
                        ? `${plan.discount_percent}%`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {plan.billing_type === "monthly" ? "Tháng" : "Năm"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          plan.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {plan.is_active ? "Hoạt động" : "Ẩn"}
                      </span>
                    </TableCell>
                    <TableCell>{plan.display_order}</TableCell>
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

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.plan_name}
                  </h3>
                  {/* <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      plan.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {plan.is_active ? "Active" : "Hidden"}
                  </span> */}
                  {plan.discount_percent > 0 && (
                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded whitespace-nowrap">
                      -{plan.discount_percent}%
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                  {plan.description}
                </p>

                <div className="mb-4 py-4 border-y">
                  <div className="flex items-baseline gap-2">
                    {plan.discount_percent > 0 ? (
                      <>
                        <span className="text-3xl font-bold text-blue-600">
                          {calculateDiscountedPrice(
                            plan.price,
                            plan.discount_percent
                          ).toLocaleString()}
                          đ
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {plan.price.toLocaleString()}đ
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-blue-600">
                        {plan.price.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    / {plan.billing_type === "monthly" ? "tháng" : "năm"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.benefits.slice(0, 4).map((benefit, idx) => (
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
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                  {plan.benefits.length > 4 && (
                    <span className="text-xs text-gray-500 pl-7">
                      +{plan.benefits.length - 4} lợi ích khác
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    Thứ tự: {plan.display_order}
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
            <div className="grid gap-2">
              <Label htmlFor="plan_name">
                Tên gói <span className="text-red-500">*</span>
              </Label>
              <Input
                id="plan_name"
                value={formData.plan_name}
                onChange={(e) =>
                  setFormData({ ...formData, plan_name: e.target.value })
                }
                placeholder="Free, Pro, Premium..."
              />
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
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Giá (VNĐ) <span className="text-red-500">*</span>
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
                <Label htmlFor="discount">Giảm giá (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount_percent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_percent: Number(e.target.value),
                    })
                  }
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="billing_type">
                  Loại thanh toán <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.billing_type}
                  onValueChange={(value: "monthly" | "yearly") =>
                    setFormData({ ...formData, billing_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Theo tháng</SelectItem>
                    <SelectItem value="yearly">Theo năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: Number(e.target.value),
                    })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="button_text">Chữ trên nút</Label>
              <Input
                id="button_text"
                value={formData.button_text}
                onChange={(e) =>
                  setFormData({ ...formData, button_text: e.target.value })
                }
                placeholder="Đăng ký, Bắt đầu ngay..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Danh sách lợi ích</Label>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder="Nhập lợi ích..."
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
                Thêm lợi ích
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
