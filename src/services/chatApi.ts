import axios from 'axios';

const API_URL = 'http://172.20.12.170:80';

export interface CreateMessageDto {
  message: string;
  senderId: string;
  chatroomId: string;
}

export const getMessages = async (chatroomId: string) => {
  try {
    const response = await axios.get(`${API_URL}/message/chatroom/${chatroomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (message: CreateMessageDto) => {
  try {
    const response = await axios.post(`${API_URL}/message`, message);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
