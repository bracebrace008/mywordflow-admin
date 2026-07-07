export interface Envelope<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface LoginResult {
  token: string;
  userId: number;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  role: 'user' | 'admin';
  totalXp: number;
  streakDays: number;
  memberSince: string;
}