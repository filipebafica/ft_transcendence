import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/',
});

export const initializeAxiosAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default axiosInstance;