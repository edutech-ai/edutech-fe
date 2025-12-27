import type { AnalyticsData, Activity, TopicPerformance } from "@/types";
import { ActivityLogType } from "@/types";

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    type: ActivityLogType.QUIZ_CREATED,
    title: "Tạo đề kiểm tra mới",
    description: "Đề kiểm tra 15 phút - Phương trình bậc nhất",
    timestamp: "2025-01-15T10:30:00Z",
  },
  {
    id: "act-2",
    type: ActivityLogType.EXAM_COMPLETED,
    title: "Kỳ thi hoàn thành",
    description: "35/40 học sinh đã hoàn thành bài kiểm tra",
    timestamp: "2025-01-14T16:45:00Z",
  },
  {
    id: "act-3",
    type: ActivityLogType.LESSON_PLAN_CREATED,
    title: "Tạo giáo án mới",
    description: "Giáo án: Hàm số bậc nhất và đồ thị",
    timestamp: "2025-01-13T09:15:00Z",
  },
  {
    id: "act-4",
    type: ActivityLogType.STUDENT_GRADED,
    title: "Hoàn thành chấm bài",
    description: "Đã chấm xong 40 bài thi môn Toán",
    timestamp: "2025-01-12T14:20:00Z",
  },
];

export const mockTopicPerformance: TopicPerformance[] = [
  {
    topic: "Phương trình bậc nhất",
    totalQuestions: 50,
    correctAnswers: 42,
    accuracy: 84,
  },
  {
    topic: "Hàm số",
    totalQuestions: 40,
    correctAnswers: 30,
    accuracy: 75,
  },
  {
    topic: "Hình học",
    totalQuestions: 35,
    correctAnswers: 28,
    accuracy: 80,
  },
  {
    topic: "Phương trình bậc hai",
    totalQuestions: 30,
    correctAnswers: 20,
    accuracy: 67,
  },
];

export const mockAnalytics: AnalyticsData = {
  totalQuizzes: 24,
  totalLessonPlans: 18,
  totalStudents: 120,
  averageScore: 7.8,
  recentActivities: mockActivities,
  performanceByTopic: mockTopicPerformance,
  difficultyDistribution: {
    easy: 35,
    medium: 45,
    hard: 20,
  },
};
