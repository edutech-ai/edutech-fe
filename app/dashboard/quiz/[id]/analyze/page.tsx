"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Info,
  BarChart3,
  Target,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/molecules/action-button";
import LaTeXRenderer from "@/components/atoms/latex-renderer";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { StoredQuizAnalysis } from "@/types/quizAnalysis";

const QUIZ_ANALYSIS_STORAGE_KEY = "edutech_quiz_analysis";

const BLOOM_COLORS: Record<string, string> = {
  "Nhận biết": "#93c5fd",
  "Thông hiểu": "#60a5fa",
  "Vận dụng": "#3b82f6",
  "Phân tích": "#2563eb",
  "Đánh giá": "#1d4ed8",
  "Sáng tạo": "#1e40af",
};

// Helper to load analysis from localStorage
function getStoredAnalysis(quizId: string): StoredQuizAnalysis | null {
  if (typeof window === "undefined") return null;
  try {
    const storedData = localStorage.getItem(QUIZ_ANALYSIS_STORAGE_KEY);
    if (!storedData) return null;
    const analyses: Record<string, StoredQuizAnalysis> = JSON.parse(storedData);
    return analyses[quizId] || null;
  } catch {
    return null;
  }
}

export default function QuizAnalyzePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  // Load analysis data using useMemo to avoid setState in useEffect
  const storedAnalysis = useMemo(() => getStoredAnalysis(quizId), [quizId]);
  const analysis = storedAnalysis?.analysis ?? null;
  const metadata = storedAnalysis?.metadata ?? null;

  const handleBack = () => {
    router.push(`/dashboard/quiz/${quizId}`);
  };

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy kết quả phân tích
        </h3>
        <p className="text-gray-600 mb-4">
          Đề thi chưa được phân tích hoặc kết quả đã bị xóa khỏi trình duyệt
        </p>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đề thi
        </Button>
      </div>
    );
  }

  // Prepare Bloom chart data
  const bloomChartData = Object.entries(analysis.bloom_distribution).map(
    ([name, value]) => ({
      name,
      value,
      fill: BLOOM_COLORS[name] || "#3b82f6",
    })
  );

  const totalBloomQuestions = Object.values(analysis.bloom_distribution).reduce(
    (sum, val) => sum + val,
    0
  );

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700";
    if (score >= 70) return "bg-blue-100 text-blue-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-100 text-gray-700";
    const colors: Record<string, string> = {
      Dễ: "bg-green-100 text-green-700",
      "Trung bình": "bg-yellow-100 text-yellow-700",
      Khó: "bg-red-100 text-red-700",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700";
  };

  // Helper to get values from analysis_summary (API may use different field names)
  const summary = analysis.analysis_summary;
  const difficultyValue =
    summary.overall_difficulty || summary.average_difficulty || "N/A";
  const focusValue = summary.focus || summary.coverage || "N/A";
  const descriptionMatchValue =
    summary.description_alignment || summary.description_match;

  // Helper to process LaTeX content - convert literal \n to actual newlines
  const processLatexContent = (content: string) => {
    if (!content) return "";
    // Replace literal \n (two characters) with actual newlines
    return content.replace(/\\n/g, "\n");
  };

  // Custom tooltip formatter
  const formatTooltip = (value: number | undefined) => {
    if (value === undefined) return ["0 câu (0%)", "Số câu"];
    const percentage =
      totalBloomQuestions > 0
        ? Math.round((value / totalBloomQuestions) * 100)
        : 0;
    return [`${value} câu (${percentage}%)`, "Số câu"];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ActionButton
        isBack
        label="Quay lại đề thi"
        href={`/dashboard/quiz/${quizId}`}
      />

      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
            Kết quả phân tích đề thi
          </h1>
          {metadata && (
            <p className="text-sm text-gray-600">
              {metadata.quiz_title} • Phân tích lúc{" "}
              {new Date(metadata.analyzed_at).toLocaleString("vi-VN")}
            </p>
          )}
        </div>
      </div>

      {/* Warning Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">Lưu ý quan trọng</p>
          <p className="text-sm text-amber-700 mt-1">
            Kết quả phân tích được lưu trên trình duyệt của bạn và sẽ không được
            đồng bộ khi đổi thiết bị hoặc xóa dữ liệu trình duyệt.
            <br />
            Vui lòng sao lưu kết quả quan trọng nếu cần thiết.
            <br />
            Ghi chú: <span className="font-mono text-gray-500">N/A</span> nghĩa
            là dữ liệu không có sẵn hoặc không thể xác định.
          </p>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Tổng quan phân tích
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tổng số câu hỏi</p>
            <p className="text-2xl font-bold text-gray-900">
              {analysis.analysis_summary.total_questions}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tổng điểm</p>
            <p className="text-2xl font-bold text-gray-900">
              {analysis.analysis_summary.total_points || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Độ khó tổng thể</p>
            <Badge className={getDifficultyColor(difficultyValue)}>
              {difficultyValue}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Trọng tâm</p>
            <p className="text-sm font-medium text-gray-900">
              {focusValue || "N/A"}
            </p>
          </div>
        </div>

        {descriptionMatchValue && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Đánh giá phù hợp với mô tả
            </p>
            <p className="text-sm text-blue-800">
              {descriptionMatchValue || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Bloom's Taxonomy Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Phân bố theo Thang Bloom
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bloomChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {bloomChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            {bloomChartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {item.value} câu
                  </span>
                  <Badge variant="outline">
                    {totalBloomQuestions > 0
                      ? Math.round((item.value / totalBloomQuestions) * 100)
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Evaluation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Đánh giá từng câu hỏi ({analysis.question_evaluation.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  #
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Kiến thức
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Bloom
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Độ khó
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  Rõ ràng
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  Phù hợp
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  Tổng
                </th>
              </tr>
            </thead>
            <tbody>
              {analysis.question_evaluation.map((q, index) => (
                <tr
                  key={q.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <span className="w-6 h-6 inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">
                      {q.knowledge_point || q.topic}
                    </p>
                    {q.comments && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {q.comments}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      style={{
                        backgroundColor: `${BLOOM_COLORS[q.bloom_level]}20`,
                        color: BLOOM_COLORS[q.bloom_level],
                      }}
                    >
                      {q.bloom_level}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getDifficultyColor(q.difficulty_level)}>
                      {q.difficulty_level}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-medium ${getScoreColor(q.clarity_score)}`}
                    >
                      {q.clarity_score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-medium ${getScoreColor(q.content_relevance_score)}`}
                    >
                      {q.content_relevance_score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={getScoreBadgeColor(q.overall_score)}>
                      {q.overall_score}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Knowledge Gaps */}
      {analysis.knowledge_gaps && analysis.knowledge_gaps.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Khoảng trống kiến thức
          </h2>
          <div className="space-y-3">
            {analysis.knowledge_gaps.map((gap, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{gap}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {analysis.ai_recommendations &&
        analysis.ai_recommendations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Đề xuất cải thiện từ AI
            </h2>
            <div className="space-y-4">
              {analysis.ai_recommendations.map((rec, index) => {
                // Handle both string and object recommendations
                const isString = typeof rec === "string";
                const recommendation = isString ? rec : rec.recommendation;
                const rationale = isString ? undefined : rec.rationale;
                const exampleQuestion = isString
                  ? undefined
                  : rec.example_question;

                return (
                  <div
                    key={index}
                    className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">
                          {recommendation}
                        </p>
                        {rationale && (
                          <p className="text-sm text-blue-700 mt-1">
                            <strong>Lý do:</strong> {rationale}
                          </p>
                        )}
                        {exampleQuestion && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              Câu hỏi mẫu:
                            </p>
                            <LaTeXRenderer
                              content={processLatexContent(
                                exampleQuestion.content
                              )}
                              className="text-sm text-gray-900"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {exampleQuestion.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {exampleQuestion.point} điểm
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {exampleQuestion.difficulty}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đề thi
        </Button>
      </div>
    </div>
  );
}
