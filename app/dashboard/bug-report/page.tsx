"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  Plus,
  CheckCircle2,
  Wrench,
  User,
  ImagePlus,
  X,
  FileVideo,
  Loader2,
} from "lucide-react";
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
import Image from "next/image";
import {
  useBugReports,
  useCreateBugReport,
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

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];
const MAX_SIZE_MB = 20;

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Không có báo cáo nào</p>
    </div>
  );
}

function ReportCard({ report }: { report: BugReport }) {
  const StatusIcon = STATUS_MAP[report.status].icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <h3 className="text-base font-semibold text-gray-800">
          {report.title}
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_MAP[report.status].color}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {STATUS_MAP[report.status].label}
        </span>
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
}: {
  list: BugReport[];
  loading?: boolean;
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
        <ReportCard key={r.id} report={r} />
      ))}
    </>
  );
}

export default function BugReportPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: allData, isLoading } = useBugReports();
  const { data: mineData } = useBugReports({ mine: true });
  const { data: confirmedData } = useBugReports({ status: "confirmed" });
  const { data: fixedData } = useBugReports({ status: "fixed" });
  const createMutation = useCreateBugReport();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        toast.error(
          `${f.name}: Chỉ hỗ trợ ảnh (JPG, PNG, WEBP) hoặc video (MP4, MOV)`
        );
        return false;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${f.name}: File quá lớn (tối đa ${MAX_SIZE_MB}MB)`);
        return false;
      }
      return true;
    });
    const newPreviews = valid.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : ""
    );
    setAttachments((prev) => [...prev, ...valid].slice(0, 5));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    if (previews[index]) URL.revokeObjectURL(previews[index]);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetModal = () => {
    previews.forEach((p) => p && URL.revokeObjectURL(p));
    setTitle("");
    setDescription("");
    setAttachments([]);
    setPreviews([]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề lỗi");
      return;
    }
    if (!description.trim()) {
      toast.error("Vui lòng mô tả chi tiết lỗi gặp phải");
      return;
    }

    // TODO: upload attachments to get URLs, then pass as attachments array
    createMutation.mutate(
      { title: title.trim(), description: description.trim(), attachments: [] },
      {
        onSuccess: () => {
          setModalOpen(false);
          resetModal();
        },
      }
    );
  };

  const all = allData?.data ?? [];
  const confirmed = confirmedData?.data ?? [];
  const fixed = fixedData?.data ?? [];
  const mine = mineData?.data ?? [];

  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo lỗi</h1>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          Gặp sự cố khi sử dụng EduQuiz? Hãy mô tả chi tiết lỗi bạn gặp phải kèm
          ảnh hoặc video minh họa để đội ngũ kỹ thuật xử lý nhanh nhất có thể.
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Trước khi báo cáo, hãy kiểm tra xem lỗi đã được ghi nhận chưa trong
          danh sách bên dưới.
        </p>
      </div>

      <div className="flex justify-end mb-5">
        <Button
          onClick={() => setModalOpen(true)}
          variant="destructive"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Báo cáo lỗi
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
          <TabsTrigger value="fixed">
            Đã sửa{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {fixed.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="own">
            Báo cáo của tôi{" "}
            <Badge variant="secondary" className="ml-1.5 text-xs">
              {mine.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          <TabContent list={all} loading={isLoading} />
        </TabsContent>
        <TabsContent value="confirmed" className="space-y-3">
          <TabContent list={confirmed} />
        </TabsContent>
        <TabsContent value="fixed" className="space-y-3">
          <TabContent list={fixed} />
        </TabsContent>
        <TabsContent value="own" className="space-y-3">
          <TabContent list={mine} />
        </TabsContent>
      </Tabs>

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) resetModal();
          setModalOpen(open);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Báo cáo lỗi hệ thống
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>
                Tiêu đề lỗi <span className="text-red-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mô tả ngắn gọn lỗi bạn gặp phải..."
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
                placeholder="Thao tác dẫn đến lỗi, thông báo lỗi, trình duyệt/thiết bị sử dụng..."
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 text-right">
                {description.length}/1000
              </p>
            </div>
            <div className="space-y-2">
              <Label>Ảnh / Video đính kèm</Label>
              <p className="text-xs text-gray-400">
                Hỗ trợ JPG, PNG, WEBP, MP4, MOV · Tối đa 5 file · Mỗi file dưới{" "}
                {MAX_SIZE_MB}MB
              </p>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center"
                    >
                      {file.type.startsWith("image/") ? (
                        <Image
                          src={previews[i]}
                          alt="preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <FileVideo className="w-6 h-6" />
                          <span className="text-[10px] truncate max-w-17 px-1">
                            {file.name}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {attachments.length < 5 && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors w-full justify-center"
                  >
                    <ImagePlus className="w-4 h-4" />
                    Thêm ảnh hoặc video
                  </button>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetModal();
                setModalOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              variant="destructive"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi báo cáo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
