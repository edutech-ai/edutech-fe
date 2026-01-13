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
