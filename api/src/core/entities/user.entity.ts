export type UserRole = 'basic' | 'manager' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  user_role: UserRole;
}
