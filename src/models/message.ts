import { ChatRoom } from './chatRoom';

export interface Message {
  id: string;                 // UUID
  chatId: ChatRoom['id'];
  senderId: number;
  message: string;
  created_at: string;
}