"use client";

import { Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { previewExamPDF, downloadExamPDF } from "@/lib/pdfGenerator";
import { Card } from "@/components/ui/card";

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
  const handleOpenInNewTab = () => {
    try {
      const url = previewExamPDF(examInfo, questions);
      window.open(url, "_blank");
      onClose();
    } catch (error) {
      console.error("Error opening PDF:", error);
    }
  };

  const handleDownload = () => {
    try {
      downloadExamPDF(examInfo, questions, false);
      onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
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
            Xem trước đề thi
          </h2>

          <p className="text-gray-600 mb-6">Chọn cách xem đề thi PDF của bạn</p>

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

          <div className="space-y-3">
            <Button onClick={handleOpenInNewTab} className="w-full" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              Mở trong tab mới
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống PDF
            </Button>

            <Button onClick={onClose} variant="ghost" className="w-full">
              Hủy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
