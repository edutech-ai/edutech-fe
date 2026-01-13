/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
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
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
  type FAQ,
  type CreateFAQRequest,
} from "@/services/settingsService";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const FAQ_CATEGORIES = [
  { value: "account", label: "Tài khoản" },
  { value: "payment", label: "Thanh toán" },
  { value: "privacy", label: "Quyền riêng tư" },
  { value: "security", label: "Bảo mật" },
  { value: "custom", label: "Khác (tự nhập)" },
];

export function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("account");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingFAQId, setDeletingFAQId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateFAQRequest>({
    question: "",
    answer: "",
    category: "",
    display_order: 0,
  });

  const createMutation = useCreateFAQ();
  const updateMutation = useUpdateFAQ();
  const deleteMutation = useDeleteFAQ();

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SETTINGS.FAQS}?active=false`
      );
      setFaqs(response.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách câu hỏi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Handle create/edit dialog
  const handleOpenDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "",
        display_order: faq.display_order,
      });

      // Check if category matches predefined ones
      const matchedCategory = FAQ_CATEGORIES.find(
        (cat) => cat.label === faq.category
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.value);
        setCustomCategory("");
      } else {
        setSelectedCategory("custom");
        setCustomCategory(faq.category || "");
      }
    } else {
      setEditingFAQ(null);
      setFormData({
        question: "",
        answer: "",
        category: "",
        display_order: 0,
      });
      setSelectedCategory("account");
      setCustomCategory("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFAQ(null);
    setFormData({
      question: "",
      answer: "",
      category: "",
      display_order: 0,
    });
    setSelectedCategory("account");
    setCustomCategory("");
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!formData.question.trim()) {
      toast.error("Vui lòng nhập câu hỏi");
      return;
    }
    if (!formData.answer.trim()) {
      toast.error("Vui lòng nhập câu trả lời");
      return;
    }

    // Determine final category value
    let finalCategory = "";
    if (selectedCategory === "custom") {
      if (!customCategory.trim()) {
        toast.error("Vui lòng nhập tên danh mục");
        return;
      }
      finalCategory = customCategory.trim();
    } else {
      const category = FAQ_CATEGORIES.find(
        (cat) => cat.value === selectedCategory
      );
      finalCategory = category ? category.label : "";
    }

    const submitData = {
      ...formData,
      category: finalCategory || undefined,
    };

    try {
      if (editingFAQ) {
        await updateMutation.mutateAsync({
          id: editingFAQ.id,
          data: submitData,
        });
        toast.success("Cập nhật câu hỏi thành công");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Tạo câu hỏi thành công");
      }
      handleCloseDialog();
      fetchFAQs();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại"
      );
    }
  };

  // Handle delete
  const handleDeleteClick = (id: string) => {
    setDeletingFAQId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFAQId) return;

    try {
      await deleteMutation.mutateAsync(deletingFAQId);
      toast.success("Xóa câu hỏi thành công");
      fetchFAQs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa câu hỏi");
    } finally {
      setDeletingFAQId(null);
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
      <div className="flex items-center justify-end">
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%] min-w-50">Câu hỏi</TableHead>
              <TableHead className="w-[35%] min-w-62.5">Câu trả lời</TableHead>
              <TableHead className="min-w-30">Danh mục</TableHead>
              <TableHead className="min-w-25">Trạng thái</TableHead>
              <TableHead className="min-w-20">Thứ tự</TableHead>
              <TableHead className="text-right min-w-25">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chưa có câu hỏi nào
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">
                    <div className="line-clamp-2">{faq.question}</div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-2 text-sm text-gray-600">
                      {faq.answer}
                    </div>
                  </TableCell>
                  <TableCell>
                    {faq.category ? (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                        {faq.category}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        faq.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {faq.is_active ? "Hoạt động" : "Ẩn"}
                    </span>
                  </TableCell>
                  <TableCell>{faq.display_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(faq.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFAQ ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
            </DialogTitle>
            <DialogDescription>
              Điền câu hỏi và câu trả lời chi tiết
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">
                Câu hỏi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="Làm thế nào để đăng ký tài khoản?"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="answer">
                Câu trả lời <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder="Bạn có thể đăng ký bằng email hoặc Google..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
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

            {selectedCategory === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor="customCategory">Tên danh mục tùy chỉnh</Label>
                <Input
                  id="customCategory"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Nhập tên danh mục..."
                />
              </div>
            )}
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
              {editingFAQ ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa câu hỏi"
        description="Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  );
}
