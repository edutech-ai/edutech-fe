"use client";

import React, { useState } from "react";
import { FormField } from "@/components/molecules/form-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { BasicExamInfo, ValidationErrors } from "./types";

interface BasicExamInfoProps {
  examInfo: BasicExamInfo;
  onUpdate: (info: BasicExamInfo) => void;
}

export function BasicExamInfoComponent({
  examInfo,
  onUpdate,
}: BasicExamInfoProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (
    field: keyof BasicExamInfo,
    value: string | number
  ): string | undefined => {
    switch (field) {
      case "name":
        if (!value || value.toString().trim() === "") {
          return "Tên đề thi không được để trống";
        }
        break;
      case "subject":
        if (!value || value.toString().trim() === "") {
          return "Môn học không được để trống";
        }
        break;
      case "durationMinutes":
        const duration = typeof value === "string" ? parseInt(value) : value;
        if (isNaN(duration) || duration < 15) {
          return "Thời gian làm bài phải ít nhất 15 phút";
        }
        if (duration > 300) {
          return "Thời gian làm bài không được quá 300 phút";
        }
        break;
      case "totalScore":
        const score = typeof value === "string" ? parseInt(value) : value;
        if (isNaN(score) || score < 1) {
          return "Tổng điểm phải lớn hơn 0";
        }
        break;
    }
    return undefined;
  };

  const handleInputChange = (
    field: keyof BasicExamInfo,
    value: string | number
  ) => {
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    onUpdate({
      ...examInfo,
      [field]: value,
    });
  };

  const grades = [6, 7, 8, 9];
  const subjects = ["Tiếng Anh", "Ngữ văn", "Toán"];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin đề thi
        </h3>

        {/* Exam Name - Full width */}
        <FormField
          label="Tên đề thi"
          name="name"
          value={examInfo.name}
          onChange={(value) => handleInputChange("name", value)}
          error={errors.name}
          placeholder="VD: Kiểm tra giữa kỳ I - Toán 10"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Môn học <span className="text-red-500">*</span>
            </Label>
            <Select
              value={examInfo.subject}
              onValueChange={(value) => handleInputChange("subject", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <Label htmlFor="grade">
              Khối lớp <span className="text-red-500">*</span>
            </Label>
            <Select
              value={examInfo.grade.toString()}
              onValueChange={(value) =>
                handleInputChange("grade", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khối" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Lớp {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <FormField
            label="Thời gian làm bài (phút)"
            name="durationMinutes"
            type="number"
            value={examInfo.durationMinutes}
            onChange={(value) => handleInputChange("durationMinutes", value)}
            error={errors.durationMinutes}
            placeholder="VD: 45, 60, 90..."
            required
          />

          {/* Total Score */}
          <FormField
            label="Tổng điểm"
            name="totalScore"
            type="number"
            value={examInfo.totalScore}
            onChange={(value) => handleInputChange("totalScore", value)}
            error={errors.totalScore}
            placeholder="VD: 10, 100..."
            required
          />
        </div>

        {/* Instructions */}
        <FormField
          label="Hướng dẫn làm bài"
          name="instructions"
          type="textarea"
          value={examInfo.instructions || ""}
          onChange={(value) => handleInputChange("instructions", value)}
          placeholder="VD: Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm."
          rows={3}
        />
      </div>
    </Card>
  );
}

export type { BasicExamInfo, ValidationErrors };
