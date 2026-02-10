"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Info,
  Calculator,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SUBJECTS, GRADES } from "@/types";
import type {
  ExamMatrix,
  ChapterDistribution,
  CognitiveDomainDistribution,
} from "@/types";

interface MatrixBuilderProps {
  initialData?: ExamMatrix;
  onSave: (data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const emptyCognitiveDomain: CognitiveDomainDistribution = {
  recognition: { count: 0, points: 0 },
  comprehension: { count: 0, points: 0 },
  application: { count: 0, points: 0 },
  highApplication: { count: 0, points: 0 },
};

const DOMAIN_LABELS = {
  recognition: "Nhận biết",
  comprehension: "Thông hiểu",
  application: "Vận dụng",
  highApplication: "VD cao",
} as const;

type DomainKey = keyof typeof DOMAIN_LABELS;

const ScoreHeader = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="inline-flex items-center gap-0.5 cursor-help">
        Điểm
        <Info className="w-3 h-3 text-gray-400" />
      </span>
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-48 text-center">
      Số điểm cho mỗi câu hỏi
      <br />
      VD: 0.2 = mỗi câu 0.2 điểm
    </TooltipContent>
  </Tooltip>
);

export function MatrixBuilder({
  initialData,
  onSave,
  onCancel,
  isSaving,
}: MatrixBuilderProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [grade, setGrade] = useState<number>(initialData?.grade || GRADES[0]);
  const [chapters, setChapters] = useState<ChapterDistribution[]>(
    initialData?.chapters || []
  );

  // Auto-fill score
  const [autoFillScore, setAutoFillScore] = useState("");
  // Key to force re-render of defaultValue inputs after bulk updates
  const [tableKey, setTableKey] = useState(0);

  // Percentage distribution modal
  const [showDistModal, setShowDistModal] = useState(false);
  const [distTotal, setDistTotal] = useState("40");
  const [distPcts, setDistPcts] = useState({
    recognition: "30",
    comprehension: "40",
    application: "20",
    highApplication: "10",
  });

  const addChapter = () => {
    const newChapter: ChapterDistribution = {
      id: `ch-${Date.now()}`,
      chapterNumber: chapters.length + 1,
      chapterName: "",
      distribution: { ...emptyCognitiveDomain },
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (id: string) => {
    setChapters(chapters.filter((ch) => ch.id !== id));
  };

  const updateChapter = (
    id: string,
    field: keyof ChapterDistribution,
    value: string | number | CognitiveDomainDistribution
  ) => {
    setChapters(
      chapters.map((ch) => (ch.id === id ? { ...ch, [field]: value } : ch))
    );
  };

  const updateDistribution = (
    chapterId: string,
    domain: keyof CognitiveDomainDistribution,
    field: "count" | "points",
    value: number
  ) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              distribution: {
                ...ch.distribution,
                [domain]: {
                  ...ch.distribution[domain],
                  [field]: value,
                },
              },
            }
          : ch
      )
    );
  };

  // Auto-fill all score cells with a single value
  const handleAutoFillScore = () => {
    const score = parseFloat(autoFillScore);
    if (isNaN(score) || chapters.length === 0) return;

    setChapters(
      chapters.map((ch) => ({
        ...ch,
        distribution: {
          recognition: { ...ch.distribution.recognition, points: score },
          comprehension: { ...ch.distribution.comprehension, points: score },
          application: { ...ch.distribution.application, points: score },
          highApplication: {
            ...ch.distribution.highApplication,
            points: score,
          },
        },
      }))
    );
    setTableKey((k) => k + 1);
  };

  // Distribute questions by percentage across chapters
  const handleDistributeByPercent = () => {
    const total = parseInt(distTotal);
    if (isNaN(total) || total <= 0 || chapters.length === 0) return;

    const domains: DomainKey[] = [
      "recognition",
      "comprehension",
      "application",
      "highApplication",
    ];

    // Calculate raw counts per domain
    const rawCounts = domains.map((d) => {
      const pct = parseFloat(distPcts[d]) || 0;
      return Math.round((total * pct) / 100);
    });

    // Adjust rounding so sum equals total
    const rawSum = rawCounts.reduce((a, b) => a + b, 0);
    let diff = total - rawSum;
    const sortedIndices = domains
      .map((_, i) => i)
      .sort(
        (a, b) =>
          (parseFloat(distPcts[domains[b]]) || 0) -
          (parseFloat(distPcts[domains[a]]) || 0)
      );

    let adjIdx = 0;
    while (diff !== 0) {
      const idx = sortedIndices[adjIdx % sortedIndices.length];
      if (diff > 0) {
        rawCounts[idx]++;
        diff--;
      } else if (rawCounts[idx] > 0) {
        rawCounts[idx]--;
        diff++;
      }
      adjIdx++;
    }

    // Distribute each domain's count evenly across chapters
    const numChapters = chapters.length;
    const updated = chapters.map((ch, chIdx) => {
      const newDist = { ...ch.distribution };
      domains.forEach((domain, domIdx) => {
        const domainTotal = rawCounts[domIdx];
        const base = Math.floor(domainTotal / numChapters);
        const remainder = domainTotal % numChapters;
        const count = base + (chIdx < remainder ? 1 : 0);
        newDist[domain] = { ...newDist[domain], count };
      });
      return { ...ch, distribution: newDist };
    });

    setChapters(updated);
    setTableKey((k) => k + 1);
    setShowDistModal(false);

    if (numChapters > 1) {
      toast.warning(
        "Hệ thống đã chia đều số câu cho các chương. Vui lòng kiểm tra và điều chỉnh lại cho phù hợp.",
        { duration: 5000 }
      );
    }
  };

  const distPctSum = Object.values(distPcts).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0
  );

  const calculateTotals = () => {
    let totalQuestions = 0;
    let totalPoints = 0;

    chapters.forEach((chapter) => {
      const dist = chapter.distribution;
      totalQuestions +=
        dist.recognition.count +
        dist.comprehension.count +
        dist.application.count +
        dist.highApplication.count;

      totalPoints +=
        dist.recognition.count * dist.recognition.points +
        dist.comprehension.count * dist.comprehension.points +
        dist.application.count * dist.application.points +
        dist.highApplication.count * dist.highApplication.points;
    });

    return { totalQuestions, totalPoints };
  };

  const handleSubmit = () => {
    const { totalQuestions, totalPoints } = calculateTotals();

    const data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt"> = {
      name,
      description,
      subject,
      grade,
      chapters,
      totalQuestions,
      totalPoints,
      createdBy: "user-1", // TODO: Get from auth
    };

    onSave(data);
  };

  const { totalQuestions, totalPoints } = calculateTotals();

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Basic Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin chung
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên ma trận <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Ma trận Toán 10 - Học kỳ 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn học <span className="text-red-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Chọn môn học</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lớp <span className="text-red-500">*</span>
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Lớp {g}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về ma trận này..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Ma trận phân phối
          </h2>
          <div className="flex items-center gap-2">
            {chapters.length > 0 && (
              <button
                onClick={() => setShowDistModal(true)}
                className="flex items-center gap-1.5 text-sm border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <Calculator className="w-4 h-4" />
                Phân phối tự động
              </button>
            )}
            <button
              onClick={addChapter}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Thêm chương
            </button>
          </div>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có chương nào. Nhấn &quot;Thêm chương&quot; để bắt đầu.
          </div>
        ) : (
          <>
            {/* Auto-fill score toolbar */}
            <div className="flex items-center gap-2 mb-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-600 shrink-0">
                Điền nhanh điểm/câu:
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={autoFillScore}
                onChange={(e) => setAutoFillScore(e.target.value)}
                placeholder="0.2"
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAutoFillScore();
                }}
              />
              <button
                onClick={handleAutoFillScore}
                disabled={!autoFillScore || isNaN(parseFloat(autoFillScore))}
                className="text-xs bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Áp dụng
              </button>
            </div>

            <TooltipProvider delayDuration={200}>
              <div className="overflow-x-auto max-w-full" key={tableKey}>
                <div className="min-w-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm font-semibold">
                          Chương
                        </th>
                        <th
                          colSpan={2}
                          className="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-semibold"
                        >
                          Nhận biết
                        </th>
                        <th
                          colSpan={2}
                          className="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-semibold"
                        >
                          Thông hiểu
                        </th>
                        <th
                          colSpan={2}
                          className="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-semibold"
                        >
                          Vận dụng
                        </th>
                        <th
                          colSpan={2}
                          className="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-semibold"
                        >
                          VD cao
                        </th>
                        <th className="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-semibold w-12 md:w-16">
                          Xóa
                        </th>
                      </tr>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-2 md:px-4 py-2" />
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          SL
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          <ScoreHeader />
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          SL
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          <ScoreHeader />
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          SL
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          <ScoreHeader />
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          SL
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-xs">
                          <ScoreHeader />
                        </th>
                        <th className="border border-gray-300 px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {chapters.map((chapter) => (
                        <tr key={chapter.id}>
                          <td className="border border-gray-300 px-2 md:px-4 py-2">
                            <input
                              type="text"
                              value={chapter.chapterName}
                              onChange={(e) =>
                                updateChapter(
                                  chapter.id,
                                  "chapterName",
                                  e.target.value
                                )
                              }
                              placeholder={`Chương ${chapter.chapterNumber}`}
                              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-blue-500 text-sm"
                            />
                          </td>

                          {/* Nhận biết */}
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              value={chapter.distribution.recognition.count}
                              onChange={(e) =>
                                updateDistribution(
                                  chapter.id,
                                  "recognition",
                                  "count",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              defaultValue={
                                chapter.distribution.recognition.points
                              }
                              onBlur={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                const num =
                                  value === "" ? 0 : parseFloat(value);
                                updateDistribution(
                                  chapter.id,
                                  "recognition",
                                  "points",
                                  isNaN(num) ? 0 : num
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>

                          {/* Thông hiểu */}
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              value={chapter.distribution.comprehension.count}
                              onChange={(e) =>
                                updateDistribution(
                                  chapter.id,
                                  "comprehension",
                                  "count",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              defaultValue={
                                chapter.distribution.comprehension.points
                              }
                              onBlur={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                const num =
                                  value === "" ? 0 : parseFloat(value);
                                updateDistribution(
                                  chapter.id,
                                  "comprehension",
                                  "points",
                                  isNaN(num) ? 0 : num
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>

                          {/* Vận dụng */}
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              value={chapter.distribution.application.count}
                              onChange={(e) =>
                                updateDistribution(
                                  chapter.id,
                                  "application",
                                  "count",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              defaultValue={
                                chapter.distribution.application.points
                              }
                              onBlur={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                const num =
                                  value === "" ? 0 : parseFloat(value);
                                updateDistribution(
                                  chapter.id,
                                  "application",
                                  "points",
                                  isNaN(num) ? 0 : num
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>

                          {/* Vận dụng cao */}
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              value={chapter.distribution.highApplication.count}
                              onChange={(e) =>
                                updateDistribution(
                                  chapter.id,
                                  "highApplication",
                                  "count",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              defaultValue={
                                chapter.distribution.highApplication.points
                              }
                              onBlur={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                const num =
                                  value === "" ? 0 : parseFloat(value);
                                updateDistribution(
                                  chapter.id,
                                  "highApplication",
                                  "points",
                                  isNaN(num) ? 0 : num
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>

                          <td className="border border-gray-300 px-2 py-2 text-center">
                            <button
                              onClick={() => removeChapter(chapter.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TooltipProvider>
          </>
        )}

        {/* Summary */}
        {chapters.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-900">Tổng cộng:</span>
              <div className="flex gap-6">
                <span className="text-gray-700">
                  <span className="font-semibold">{totalQuestions}</span> câu
                  hỏi
                </span>
                <span className="text-gray-700">
                  <span className="font-semibold">
                    {totalPoints.toFixed(1)}
                  </span>{" "}
                  điểm
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name || !subject || chapters.length === 0 || isSaving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Đang lưu..." : "Lưu ma trận"}
        </button>
      </div>

      {/* Percentage Distribution Modal */}
      <Dialog open={showDistModal} onOpenChange={setShowDistModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Phân phối câu hỏi tự động</DialogTitle>
            <DialogDescription>
              Nhập tổng số câu và tỷ lệ % cho từng mức độ. Câu hỏi sẽ được phân
              đều cho {chapters.length} chương.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tổng số câu hỏi
              </label>
              <input
                type="number"
                min="1"
                value={distTotal}
                onChange={(e) => setDistTotal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Tỷ lệ phân phối (%)
              </label>
              {(Object.keys(DOMAIN_LABELS) as DomainKey[]).map((domain) => (
                <div key={domain} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24 shrink-0">
                    {DOMAIN_LABELS[domain]}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={distPcts[domain]}
                    onChange={(e) =>
                      setDistPcts((prev) => ({
                        ...prev,
                        [domain]: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <span className="text-sm text-gray-400 w-4">%</span>
                </div>
              ))}
            </div>

            {/* Sum indicator */}
            <div
              className={`text-sm px-3 py-2 rounded-lg ${
                distPctSum === 100
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              Tổng: {distPctSum}%{distPctSum !== 100 && " (cần bằng 100%)"}
            </div>

            {/* Warning for multiple chapters */}
            {chapters.length > 1 && (
              <div className="flex items-start gap-2 text-sm px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Có {chapters.length} chương — hệ thống sẽ{" "}
                  <strong>chia đều</strong> số câu cho mỗi chương. Bạn cần kiểm
                  tra và điều chỉnh lại sau khi áp dụng.
                </span>
              </div>
            )}

            {/* Preview */}
            {distPctSum === 100 && parseInt(distTotal) > 0 && (
              <div className="text-xs text-gray-500 space-y-0.5 px-3 py-2 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700 mb-1">Xem trước:</p>
                {(Object.keys(DOMAIN_LABELS) as DomainKey[]).map((domain) => {
                  const count = Math.round(
                    (parseInt(distTotal) *
                      (parseFloat(distPcts[domain]) || 0)) /
                      100
                  );
                  return (
                    <p key={domain}>
                      {DOMAIN_LABELS[domain]}: ~{count} câu
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowDistModal(false)}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleDistributeByPercent}
              disabled={
                distPctSum !== 100 ||
                !parseInt(distTotal) ||
                parseInt(distTotal) <= 0
              }
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
