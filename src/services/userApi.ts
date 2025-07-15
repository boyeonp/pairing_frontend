import axios from 'axios';

const API_URL = 'http://172.20.12.170';

export const findUserByName = async (name: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/by-name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error finding user by name:', error);
    throw error;
  }
};

export const updateUser = async (id: number, data: { love: number }) => {
  try {
    const response = await axios.patch(`${API_URL}/user/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
