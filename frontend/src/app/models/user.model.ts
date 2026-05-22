export interface UserProfile {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: 'Admin' | 'General User';
  status: string;
  password?: string;
}
