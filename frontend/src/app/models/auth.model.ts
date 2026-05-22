import { UserProfile } from './user.model';

export interface LoginPayload {
  userId: string;
  password: string;
  role: 'Admin' | 'General User';
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserSession extends UserProfile { }
