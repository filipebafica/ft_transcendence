import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE_URL,
});

export const initializeAxiosAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

axiosInstance.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

export default axiosInstance;