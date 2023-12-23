import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/',
  // baseURL: process.env.REACT_APP_API_BASE_URL || "https://31c9-2001-1388-91-6e3-472-8abc-b4a4-d06.ngrok-free.app",
});

export const initializeAxiosAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default axiosInstance;