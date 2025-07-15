import axios from 'axios';

const API_URL = 'http://172.20.12.170:80/auth'; // Adjust the URL to your backend's address

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
