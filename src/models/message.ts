import { User } from './user';

export interface Message {
  id: string;
  message: string;
  created_at: string;
  sender: User;
}
