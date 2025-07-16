import axios from 'axios';

const API_URL = 'http://172.20.12.170:80';

export const findUserByName = async (name: string) => {
try {
    const response = await axios.get(`${API_URL}/user/by-name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error finding user by name:', error);
    throw error;
  }
};

export const updateUser = async (id: number, data: { love?: number; email?: string; comment?: string; profileEmoji?: string }) => {
  try {
    const response = await axios.patch(`${API_URL}/user/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getLoveAlarmCount = async (userId: number, location: { latitude: number, longitude: number }) => {
  try {
    const res = await axios.get(`${API_URL}/love-alarm/count`, {
      params: {
        userId,
        lat: location.latitude,
        lon: location.longitude,
      },
    });
    return res.data;          // { crushCount: number }
  } catch (error) {
    console.error('Error getting love alarm count:', error);
    throw error;
  }
};
