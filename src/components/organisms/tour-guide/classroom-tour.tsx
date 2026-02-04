"use client";

import React from "react";
import type { TourStep } from "./index";
import { TourGuide } from "./index";

const classroomTourSteps: TourStep[] = [
  {
    target: "",
    title: "Quản lý lớp học",
    description: (
      <div>
        <p>
          Chào mừng bạn đến với trang <strong>quản lý lớp học</strong>!
        </p>
        <p>Hãy cùng tìm hiểu các tính năng chính.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "classroom-tabs",
    title: "Các tab chức năng",
    description: (
      <div>
        <p>Lớp học có 4 tab chính:</p>
        <ul>
          <li>
            <strong>Random:</strong> Gọi ngẫu nhiên học sinh
          </li>
          <li>
            <strong>Lớp học:</strong> Sơ đồ chỗ ngồi & giơ tay
          </li>
          <li>
            <strong>Dữ liệu:</strong> Danh sách học sinh
          </li>
          <li>
            <strong>Hiệu suất:</strong> Điểm số & thống kê
          </li>
        </ul>
      </div>
    ),
    placement: "bottom",
    highlight: true,
  },
  {
    target: "tab-random",
    title: "Random học sinh",
    description: (
      <div>
        <p>
          Gọi <strong>ngẫu nhiên</strong> học sinh trong lớp.
        </p>
        <p>Phù hợp cho các hoạt động tương tác, kiểm tra bài.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "tab-classroom",
    title: "Giao diện lớp học",
    description: (
      <div>
        <p>
          Xem <strong>sơ đồ chỗ ngồi</strong> và theo dõi{" "}
          <strong>giơ tay phát biểu</strong>.
        </p>
        <p>Bắt đầu phiên học để ghi nhận hoạt động học sinh.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "tab-data",
    title: "Dữ liệu học sinh",
    description: (
      <div>
        <p>
          Quản lý <strong>danh sách học sinh</strong>: thêm, sửa, xóa.
        </p>
        <p>Xem thông tin liên lạc và mã học sinh.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "tab-performance",
    title: "Hiệu suất & Điểm",
    description: (
      <div>
        <p>
          Theo dõi <strong>điểm số</strong> và <strong>hiệu suất</strong> học
          tập của học sinh.
        </p>
        <p>Xem thống kê, biểu đồ tiến bộ.</p>
      </div>
    ),
    placement: "bottom",
  },
];

interface ClassroomTourProps {
  onComplete?: () => void;
}

export const ClassroomTour: React.FC<ClassroomTourProps> = ({ onComplete }) => {
  return (
    <TourGuide
      steps={classroomTourSteps}
      storageKey="classroom-tour-completed"
      onComplete={onComplete}
      autoStart={true}
      autoStartDelay={800}
    />
  );
};

export default ClassroomTour;
