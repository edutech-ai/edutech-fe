"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import type {
  ExamMatrix,
  ChapterDistribution,
  CognitiveDomainDistribution,
} from "@/types";

interface MatrixBuilderProps {
  initialData?: ExamMatrix;
  onSave: (data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const emptyCognitiveDomain: CognitiveDomainDistribution = {
  recognition: { count: 0, points: 0 },
  comprehension: { count: 0, points: 0 },
  application: { count: 0, points: 0 },
  highApplication: { count: 0, points: 0 },
};

export function MatrixBuilder({
  initialData,
  onSave,
  onCancel,
}: MatrixBuilderProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [grade, setGrade] = useState<number>(initialData?.grade || 10);
  const [chapters, setChapters] = useState<ChapterDistribution[]>(
    initialData?.chapters || []
  );

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Toán, Lý, Hóa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lớp <span className="text-red-500">*</span>
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((g) => (
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <button
            onClick={addChapter}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Thêm chương
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có chương nào. Nhấn &quot;Thêm chương&quot; để bắt đầu.
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <div className="min-w-[800px]">
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
                      Điểm
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-xs">
                      SL
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-xs">
                      Điểm
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-xs">
                      SL
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-xs">
                      Điểm
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-xs">
                      SL
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-xs">
                      Điểm
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
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 text-sm"
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
                          defaultValue={chapter.distribution.recognition.points}
                          onBlur={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            const num = value === "" ? 0 : parseFloat(value);
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
                            const num = value === "" ? 0 : parseFloat(value);
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
                          defaultValue={chapter.distribution.application.points}
                          onBlur={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            const num = value === "" ? 0 : parseFloat(value);
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
                            const num = value === "" ? 0 : parseFloat(value);
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
          disabled={!name || !subject || chapters.length === 0}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Lưu ma trận
        </button>
      </div>
    </div>
  );
}
