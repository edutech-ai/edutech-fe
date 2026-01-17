"use client";

import { useState } from "react";
import { Settings2, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { quizMockService } from "@/services/mock/quizService";
import {
  Difficulty,
  QuestionTypeUI,
  type QuestionUI,
  type QuizGenerateRequest,
} from "@/types";

interface QuizGeneratorFormProps {
  onGenerate: (questions: QuestionUI[]) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export function QuizGeneratorForm({
  onGenerate,
  isGenerating,
  setIsGenerating,
}: QuizGeneratorFormProps) {
  const [formData, setFormData] = useState<QuizGenerateRequest>({
    subject: "Tiếng Anh",
    grade: 8,
    topic: "",
    numQuestions: 10,
    difficulty: Difficulty.COMPREHENSION,
    questionTypes: [QuestionTypeUI.SINGLE_CHOICE],
    learningObjectives: "",
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const questions = await quizMockService.generateQuiz(formData);
      onGenerate(questions);
    } catch {
      onGenerate([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-white border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Cấu hình đề thi</h2>
      </div>

      <div className="space-y-5">
        {/* Subject and Grade */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subject">Môn học *</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) =>
                setFormData({ ...formData, subject: value })
              }
            >
              <SelectTrigger id="subject" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                <SelectItem value="Ngữ văn">Ngữ văn</SelectItem>
                <SelectItem value="Toán">Toán</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="grade">Lớp *</Label>
            <Select
              value={formData.grade.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, grade: parseInt(value) })
              }
            >
              <SelectTrigger id="grade" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[6, 7, 8, 9].map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Lớp {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Topic */}
        <div>
          <Label htmlFor="topic">Chủ đề *</Label>
          <Input
            id="topic"
            placeholder="VD: Phương trình bậc 2, Quang hợp, Chiến tranh thế giới..."
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
            className="mt-1.5"
          />
        </div>

        {/* Number of Questions and Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numQuestions">Số câu hỏi *</Label>
            <Input
              id="numQuestions"
              type="number"
              min={1}
              max={50}
              value={formData.numQuestions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numQuestions: parseInt(e.target.value) || 1,
                })
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Độ khó</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) =>
                setFormData({ ...formData, difficulty: value as Difficulty })
              }
            >
              <SelectTrigger id="difficulty" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Difficulty.RECOGNITION}>
                  Nhận biết
                </SelectItem>
                <SelectItem value={Difficulty.COMPREHENSION}>
                  Thông hiểu
                </SelectItem>
                <SelectItem value={Difficulty.APPLICATION}>Vận dụng</SelectItem>
                <SelectItem value={Difficulty.HIGH_APPLICATION}>
                  Vận dụng cao
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Question Types */}
        <div>
          <Label htmlFor="questionTypes">Loại câu hỏi</Label>
          <Select
            value={formData.questionTypes[0]}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                questionTypes: [value],
              })
            }
          >
            <SelectTrigger id="questionTypes" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QuestionTypeUI.SINGLE_CHOICE}>
                Trắc nghiệm
              </SelectItem>
              <SelectItem value={QuestionTypeUI.TRUE_FALSE}>
                Đúng/Sai
              </SelectItem>
              <SelectItem value={QuestionTypeUI.ESSAY}>Tự luận</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Learning Objectives */}
        <div>
          <Label htmlFor="objectives">Mục tiêu học tập (không bắt buộc)</Label>
          <Textarea
            id="objectives"
            placeholder="Mô tả ngắn gọn mục tiêu kiến thức cần đánh giá..."
            value={formData.learningObjectives}
            onChange={(e) =>
              setFormData({ ...formData, learningObjectives: e.target.value })
            }
            className="mt-1.5 min-h-25"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !formData.topic}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Đang tạo câu hỏi...
            </>
          ) : (
            <>Tạo đề thi với AI</>
          )}
        </Button>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <FileQuestion className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800">
            AI sẽ tạo câu hỏi dựa trên chủ đề, độ khó và mục tiêu học tập bạn
            cung cấp. Quá trình có thể mất 2-3 giây.
          </p>
        </div>
      </div>
    </Card>
  );
}
