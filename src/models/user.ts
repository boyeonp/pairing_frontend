export interface User {
  id: number;
  email: string;
  username: string;
  age: number;
  class: number;
  profileEmoji: string;
  comment: string | null;
  love: number;
  created_at: string;
}