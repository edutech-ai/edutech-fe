"use client";

import React from "react";
import type { TourStep } from "./index";
import { TourGuide } from "./index";

const promptQuizTourSteps: TourStep[] = [
  {
    target: "", // Empty = center of screen
    title: "Tạo đề thi với AI",
    description: (
      <div>
        <p>
          Chào mừng bạn đến với công cụ <strong>tạo đề thi bằng AI</strong>!
        </p>
        <p>Hãy cùng tìm hiểu cách sử dụng để tạo ra đề thi phù hợp nhất.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "subject-grade",
    title: "Môn học & Lớp",
    description: (
      <div>
        <p>
          <strong>Đây là yếu tố quan trọng nhất!</strong>
        </p>
        <p>
          AI sẽ dựa vào <em>môn học</em> và <em>lớp</em> để xác định:
        </p>
        <ul>
          <li>Chương trình học phù hợp</li>
          <li>Độ khó chuẩn theo cấp độ</li>
          <li>Từ vựng và thuật ngữ chuyên ngành</li>
        </ul>
      </div>
    ),
    placement: "bottom",
    highlight: true,
  },
  {
    target: "quiz-settings",
    title: "Cài đặt đề thi",
    description: (
      <div>
        <p>
          <strong>Các thông số quyết định chất lượng đề:</strong>
        </p>
        <ul>
          <li>
            <strong>Số câu hỏi:</strong> Tối đa 25 câu để đảm bảo chất lượng
          </li>
          <li>
            <strong>Độ khó:</strong> Dễ → Trung bình → Khó
          </li>
          <li>
            <strong>Thời gian:</strong> Ảnh hưởng đến độ phức tạp câu hỏi
          </li>
        </ul>
      </div>
    ),
    placement: "top",
    highlight: true,
  },
  {
    target: "prompt-input",
    title: "Chủ đề & Nội dung",
    description: (
      <div>
        <p>
          Mô tả <strong>ngữ cảnh</strong> và <strong>phạm vi kiến thức</strong>{" "}
          cần kiểm tra.
        </p>
        <p>
          <em>Lưu ý:</em> Prompt giúp làm rõ ngữ cảnh, nhưng{" "}
          <strong>môn học và lớp</strong> vẫn là yếu tố quyết định chính.
        </p>
        <p>Ví dụ: &quot;Kiểm tra về phương trình bậc hai, bao gồm...&quot;</p>
      </div>
    ),
    placement: "top",
  },
  {
    target: "learning-objectives",
    title: "Mục tiêu học tập",
    description: (
      <div>
        <p>
          <em>(Tùy chọn)</em> Giúp AI tập trung vào các kỹ năng cần đánh giá:
        </p>
        <ul>
          <li>Ghi nhớ kiến thức</li>
          <li>Hiểu và phân tích</li>
          <li>Vận dụng thực tế</li>
        </ul>
      </div>
    ),
    placement: "top",
  },
  {
    target: "generate-btn",
    title: "Tạo đề thi",
    description: (
      <div>
        <p>Nhấn nút này để AI bắt đầu tạo đề thi.</p>
        <p>
          Sau khi hoàn thành, bạn có thể <strong>chỉnh sửa</strong> lại đề thi
          theo ý muốn.
        </p>
      </div>
    ),
    placement: "top",
  },
];

interface PromptQuizTourProps {
  onComplete?: () => void;
}

export const PromptQuizTour: React.FC<PromptQuizTourProps> = ({
  onComplete,
}) => {
  return (
    <TourGuide
      steps={promptQuizTourSteps}
      storageKey="prompt-quiz-tour-completed"
      onComplete={onComplete}
      autoStart={true}
      autoStartDelay={800}
    />
  );
};

export default PromptQuizTour;
