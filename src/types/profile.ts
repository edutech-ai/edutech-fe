export interface Profile {
  id: string;
  email: string;
  role: string;
  subject: string | null;
  status: string;
  created_at: string;
  name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  avatar_url: string | null;
  address: string | null;
  email_notification: boolean | null;
  push_notification: boolean | null;
}

export interface UpdateProfileRequest {
  name?: string;
  date_of_birth?: string | null;
  gender?: string | null;
  avatar_url?: string | null;
  address?: string | null;
  email_notification?: boolean;
  push_notification?: boolean;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export interface TeacherStats {
  total_quizzes: number;
  total_matrices: number;
  total_students: number;
  total_classrooms: number;
}

export interface RecentActivity {
  type: "quiz_created" | "matrix_created" | "grading_completed";
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    quiz_id?: string;
    matrix_id?: string;
    student_count?: number;
  };
}
