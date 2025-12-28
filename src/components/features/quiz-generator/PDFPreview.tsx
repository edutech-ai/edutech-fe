"use client";

import { Download, ExternalLink, FileText, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadExamPDF, generateExamPDF } from "@/lib/pdfGeneratorNew";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface ExamInfo {
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  instructions?: string;
}

interface Question {
  id: string;
  order: number;
  content: string;
  type: string;
  answers?: string[];
  points: number;
}

interface PDFPreviewProps {
  examInfo: ExamInfo;
  questions: Question[];
  open: boolean;
  onClose: () => void;
}

export function PDFPreview({
  examInfo,
  questions,
  open,
  onClose,
}: PDFPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenInNewTab = async (includeAnswers = false) => {
    try {
      setIsGenerating(true);
      const blob = await generateExamPDF(examInfo, questions, includeAnswers);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      onClose();
    } catch (error) {
      console.error("Error opening PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (includeAnswers = false) => {
    try {
      setIsGenerating(true);
      await downloadExamPDF(examInfo, questions, includeAnswers);
      onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="bg-white rounded-lg w-full max-w-md p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Xuất đề thi PDF
          </h2>

          <p className="text-gray-600 mb-6">
            Chọn phiên bản muốn xuất (cùng 1 đề thi)
          </p>

          <div className="space-y-3 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg text-left">
              <p className="text-sm font-medium text-gray-900">
                {examInfo.subject} - {examInfo.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {questions.length} câu hỏi • {examInfo.totalScore} điểm •{" "}
                {examInfo.durationMinutes} phút
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Đề thi cho học sinh
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleOpenInNewTab(false)}
                  className="flex-1"
                  variant="outline"
                  disabled={isGenerating}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {isGenerating ? "Đang tạo..." : "Xem"}
                </Button>
                <Button
                  onClick={() => handleDownload(false)}
                  className="flex-1"
                  variant="outline"
                  disabled={isGenerating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? "Đang tạo..." : "Tải về"}
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Đáp án (dành cho giáo viên)
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleOpenInNewTab(true)}
                  className="flex-1"
                  variant="outline"
                  disabled={isGenerating}
                >
                  <Key className="w-4 h-4 mr-2" />
                  {isGenerating ? "Đang tạo..." : "Xem"}
                </Button>
                <Button
                  onClick={() => handleDownload(true)}
                  className="flex-1"
                  variant="outline"
                  disabled={isGenerating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? "Đang tạo..." : "Tải về"}
                </Button>
              </div>
            </div>

            <Button onClick={onClose} variant="ghost" className="w-full">
              Hủy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
