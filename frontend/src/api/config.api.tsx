import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localost:8080',
});

axiosInstance.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

export default axiosInstance;