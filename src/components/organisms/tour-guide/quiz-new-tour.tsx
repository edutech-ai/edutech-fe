"use client";

import React from "react";
import type { TourStep } from "./index";
import { TourGuide } from "./index";

const quizNewTourSteps: TourStep[] = [
  {
    target: "",
    title: "Tạo đề thi mới",
    description: (
      <div>
        <p>
          Chào mừng bạn đến với trang <strong>tạo đề thi</strong>!
        </p>
        <p>Hãy cùng tìm hiểu cách tạo đề thi hiệu quả.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "quiz-tabs",
    title: "Hai tab chính",
    description: (
      <div>
        <p>Đề thi có 2 phần:</p>
        <ul>
          <li>
            <strong>Thông tin đề thi:</strong> Tên, môn, lớp, thời gian
          </li>
          <li>
            <strong>Danh sách câu hỏi:</strong> Thêm và quản lý câu hỏi
          </li>
        </ul>
      </div>
    ),
    placement: "bottom",
    highlight: true,
  },
  {
    target: "tab-info",
    title: "Thông tin đề thi",
    description: (
      <div>
        <p>
          Điền <strong>thông tin cơ bản</strong> của đề thi:
        </p>
        <ul>
          <li>Tên đề thi</li>
          <li>Môn học & Lớp</li>
          <li>Thời gian làm bài</li>
          <li>Mô tả (tùy chọn)</li>
        </ul>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "tab-questions",
    title: "Danh sách câu hỏi",
    description: (
      <div>
        <p>
          Quản lý <strong>tất cả câu hỏi</strong> trong đề thi.
        </p>
        <p>Bấm vào tab này để xem và thêm câu hỏi.</p>
      </div>
    ),
    placement: "bottom",
    clickTarget: true, // Tự động click để chuyển tab
  },
  {
    target: "add-question-btn",
    title: "Thêm câu hỏi",
    description: (
      <div>
        <p>
          Bấm nút này để <strong>thêm câu hỏi mới</strong>.
        </p>
        <p>Hỗ trợ nhiều loại: Trắc nghiệm, Đúng/Sai, Tự luận...</p>
      </div>
    ),
    placement: "bottom",
    highlight: true,
  },
  {
    target: "quiz-actions",
    title: "Lưu & Xuất bản",
    description: (
      <div>
        <p>Sau khi hoàn thành, bạn có thể:</p>
        <ul>
          <li>
            <strong>Xuất PDF:</strong> Tải đề thi dạng file
          </li>
          <li>
            <strong>Lưu bản nháp:</strong> Tiếp tục chỉnh sửa sau
          </li>
          <li>
            <strong>Xuất bản:</strong> Công khai đề thi
          </li>
        </ul>
      </div>
    ),
    placement: "bottom",
  },
];

interface QuizNewTourProps {
  onComplete?: () => void;
}

export const QuizNewTour: React.FC<QuizNewTourProps> = ({ onComplete }) => {
  return (
    <TourGuide
      steps={quizNewTourSteps}
      storageKey="quiz-new-tour-completed"
      onComplete={onComplete}
      autoStart={true}
      autoStartDelay={800}
    />
  );
};

export default QuizNewTour;
