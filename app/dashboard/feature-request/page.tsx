"use client";

import { useState } from "react";
import { ThumbsUp, Plus, Lightbulb, Rocket, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useFeatureRequests,
  useCreateFeatureRequest,
  useToggleFeatureLike,
  type FeatureRequest,
} from "@/services/reportService";

const STATUS_MAP = {
  pending: { label: "Đang chờ", color: "bg-gray-100 text-gray-600" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-600" },
  deployed: { label: "Đã triển khai", color: "bg-green-100 text-green-700" },
};

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
  onLike,
  liking,
}: {
  request: FeatureRequest;
  onLike: (id: number) => void;
  liking: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => onLike(request.id)}
        disabled={liking}
        className={`flex flex-col items-center gap-1 min-w-13 pt-1 rounded-xl px-2 py-2 transition-all ${
          request.liked
            ? "text-blue-600 bg-blue-50"
            : "text-gray-400 hover:bg-gray-50 hover:text-blue-500"
        }`}
      >
        <ThumbsUp
          className={`w-5 h-5 ${request.liked ? "fill-blue-600" : ""}`}
        />
        <span className="text-sm font-semibold">{request.likes_count}</span>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-gray-800">
            {request.title}
          </h3>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_MAP[request.status].color}`}
          >
            {STATUS_MAP[request.status].label}
          </span>
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
  onLike,
  liking,
}: {
  list: FeatureRequest[];
  loading?: boolean;
  onLike: (id: number) => void;
  liking: boolean;
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
        <RequestCard key={r.id} request={r} onLike={onLike} liking={liking} />
      ))}
    </>
  );
}

export default function FeatureRequestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: allData, isLoading } = useFeatureRequests();
  const { data: confirmedData } = useFeatureRequests({ status: "confirmed" });
  const { data: deployedData } = useFeatureRequests({ status: "deployed" });
  const { data: mineData } = useFeatureRequests({ mine: true });
  const createMutation = useCreateFeatureRequest();
  const likeMutation = useToggleFeatureLike();

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề đề xuất");
      return;
    }
    if (!description.trim()) {
      toast.error("Vui lòng mô tả tính năng bạn mong muốn");
      return;
    }
    createMutation.mutate(
      { title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setModalOpen(false);
        },
      }
    );
  };

  const all = allData?.data ?? [];
  const confirmed = confirmedData?.data ?? [];
  const deployed = deployedData?.data ?? [];
  const mine = mineData?.data ?? [];

  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đề xuất tính năng
          </h1>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          Chúng tôi tin rằng những người dùng thực tế mới là người hiểu rõ nhất
          mình cần gì. Mỗi tuần, đề xuất nhận được nhiều lượt bình chọn nhất sẽ
          được đội ngũ EduQuiz hiện thực hóa thành tính năng mới — và tất cả
          giáo viên VIP sẽ được trải nghiệm sớm nhất.
        </p>
        <p className="text-gray-400 text-xs mt-2 leading-relaxed max-w-2xl">
          Trước khi tạo đề xuất mới, hãy xem qua danh sách bên dưới — nếu đã có
          ý tưởng tương tự, hãy bấm <strong>Thích</strong> để bầu chọn thay vì
          tạo trùng lặp.
        </p>
      </div>

      <div className="flex justify-end mb-5">
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo đề xuất
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-5 w-full justify-start">
          <TabsTrigger value="all">
            Tất cả{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {all.length}
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
          <TabsTrigger value="own">
            Đề xuất của tôi{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {mine.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          <TabContent
            list={all}
            loading={isLoading}
            onLike={likeMutation.mutate}
            liking={likeMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="confirmed" className="space-y-3">
          <TabContent
            list={confirmed}
            onLike={likeMutation.mutate}
            liking={likeMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="deployed" className="space-y-3">
          <TabContent
            list={deployed}
            onLike={likeMutation.mutate}
            liking={likeMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="own" className="space-y-3">
          <TabContent
            list={mine}
            onLike={likeMutation.mutate}
            liking={likeMutation.isPending}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Tạo đề xuất tính năng
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên tính năng bạn mong muốn..."
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Mô tả chi tiết <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cụ thể tính năng và lý do cần thiết..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right">
                {description.length}/500
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi đề xuất"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
