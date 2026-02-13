"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Quiz } from "@/types";
import { SUBJECTS, GRADES } from "@/types";

// Extended Quiz type for UI with folder support (not in backend yet)
interface QuizFormData extends Partial<Quiz> {
  folder?: string;
}

interface QuizInfoTabProps {
  quiz: QuizFormData;
  onUpdate: (updates: QuizFormData) => void;
}

export function QuizInfoTab({ quiz, onUpdate }: QuizInfoTabProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="space-y-6 max-w-3xl">
        {/* Quiz Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Tên đề thi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={quiz.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Ví dụ: Kiểm tra giữa kỳ 1 - Toán 8"
          />
        </div>

        {/* Folder Selection */}
        <div className="space-y-2">
          <Label htmlFor="folder">Lưu vào thư mục</Label>
          <Select
            value={quiz.folder || ""}
            onValueChange={(value) => onUpdate({ folder: value })}
          >
            <SelectTrigger id="folder">
              <SelectValue placeholder="Chọn thư mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Toán 6A</SelectItem>
              <SelectItem value="midterm">Toán 6B</SelectItem>
              <SelectItem value="final">Toán 8A</SelectItem>
              <SelectItem value="practice">Toán 8B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subject & Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">
              Môn học <span className="text-red-500">*</span>
            </Label>
            <Select
              value={quiz.subject || ""}
              onValueChange={(value) => onUpdate({ subject: value })}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">
              Lớp <span className="text-red-500">*</span>
            </Label>
            <Select
              value={quiz.grade?.toString() || ""}
              onValueChange={(value) => onUpdate({ grade: parseInt(value) })}
            >
              <SelectTrigger id="grade">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                {GRADES.map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Lớp {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">
              Thời gian làm bài (phút) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="300"
              value={quiz.duration || ""}
              onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
              placeholder="Ví dụ: 60"
            />
            <p className="text-xs text-gray-500">
              Thời gian tối đa học sinh có thể làm bài (tính bằng phút)
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <Label htmlFor="description">Hướng dẫn / Lưu ý làm bài</Label>
          <Textarea
            id="description"
            value={quiz.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Ví dụ: Học sinh không được sử dụng tài liệu. Làm bài trên giấy thi được phát..."
            rows={5}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Các hướng dẫn hoặc lưu ý quan trọng cho học sinh khi làm bài
          </p>
        </div>
      </div>
    </div>
  );
}
