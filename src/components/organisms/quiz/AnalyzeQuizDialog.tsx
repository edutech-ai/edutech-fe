"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AILoading } from "@/components/atoms/AILoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAnalyzeQuiz } from "@/services/aiService";
import { toast } from "sonner";
import type { StoredQuizAnalysis } from "@/types/quizAnalysis";

interface AnalyzeQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  quizTitle: string;
}

const QUIZ_ANALYSIS_STORAGE_KEY = "edutech_quiz_analysis";

export function AnalyzeQuizDialog({
  open,
  onOpenChange,
  quizId,
  quizTitle,
}: AnalyzeQuizDialogProps) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const analyzeQuizMutation = useAnalyzeQuiz();

  const handleClose = () => {
    if (!analyzeQuizMutation.isPending) {
      setDescription("");
      onOpenChange(false);
    }
  };

  const handleAnalyze = async () => {
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả đề thi để AI phân tích chính xác hơn");
      return;
    }

    try {
      const response = await analyzeQuizMutation.mutateAsync({
        quiz_id: quizId,
        description: description.trim(),
      });

      // Store analysis result in localStorage
      const storedAnalysis: StoredQuizAnalysis = {
        quizId,
        analysis: response.data,
        metadata: response.metadata,
        storedAt: new Date().toISOString(),
      };

      // Get existing analyses or create new object
      const existingData = localStorage.getItem(QUIZ_ANALYSIS_STORAGE_KEY);
      const analyses: Record<string, StoredQuizAnalysis> = existingData
        ? JSON.parse(existingData)
        : {};

      // Store with quiz ID as key
      analyses[quizId] = storedAnalysis;
      localStorage.setItem(QUIZ_ANALYSIS_STORAGE_KEY, JSON.stringify(analyses));

      toast.success("Phân tích đề thi thành công!");
      onOpenChange(false);
      setDescription("");

      // Navigate to analysis result page
      router.push(`/dashboard/quiz/${quizId}/analyze`);
    } catch (error) {
      console.error("Error analyzing quiz:", error);
      toast.error("Không thể phân tích đề thi. Vui lòng thử lại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-137.5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Phân tích đề thi với AI
          </DialogTitle>
          <DialogDescription>
            Nhập mô tả về đề thi để AI có thể phân tích chính xác và đưa ra đánh
            giá phù hợp nhất.
          </DialogDescription>
        </DialogHeader>

        {analyzeQuizMutation.isPending ? (
          <AILoading
            message="AI đang phân tích đề thi..."
            submessage="Đánh giá chất lượng và phân tích nội dung đề thi"
          />
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Đề thi:</strong> {quizTitle}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả đề thi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ví dụ: Đây là đề kiểm tra 15 phút cho học sinh trung bình, tập trung vào hình học cơ bản lớp 8"
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Mô tả giúp AI hiểu rõ hơn về mục đích và đối tượng của đề thi
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button onClick={handleAnalyze}>Phân tích</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
