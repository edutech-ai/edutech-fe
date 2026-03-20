"use client";

import NextImage from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadExamPDF, generateExamPDF } from "@/lib/pdfGeneratorNew";
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
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b">
          <div className="flex items-center gap-3">
            <NextImage
              src="/images/icons/icon_pdf3d.png"
              alt="PDF"
              width={64}
              height={64}
              className="object-contain shrink-0"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tạo file PDF</h2>
              <p className="text-sm text-gray-500">{examInfo.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors self-start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 space-y-3">
          {/* Đề học sinh */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Đề cho học sinh
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleOpenInNewTab(false)}
                className="flex-1 bg-white text-gray-700 hover:bg-gray-50"
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                <NextImage
                  src="/images/icons/icon_view-newtab.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-1.5"
                />
                Xem
              </Button>
              <Button
                onClick={() => handleDownload(false)}
                className="flex-1 bg-white text-primary border-primary hover:bg-primary/5"
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                <NextImage
                  src="/images/icons/icon_download.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-1.5"
                />
                {isGenerating ? "Đang tạo..." : "Tải về"}
              </Button>
            </div>
          </div>

          {/* Đáp án giáo viên */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Đáp án (giáo viên)
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleOpenInNewTab(true)}
                className="flex-1 bg-white text-gray-700 hover:bg-gray-50"
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                <NextImage
                  src="/images/icons/icon_view-newtab.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-1.5"
                />
                Xem
              </Button>
              <Button
                onClick={() => handleDownload(true)}
                className="flex-1 bg-white text-primary border-primary hover:bg-primary/5"
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                <NextImage
                  src="/images/icons/icon_download.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-1.5"
                />
                {isGenerating ? "Đang tạo..." : "Tải về"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
