import axios from 'axios';

// Initialize the Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can attach a token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Directly return the data payload
  },
  (error) => {
    // Centralized error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API Error:', error.response.data);
      // Example: Handle 401 Unauthorized globally
      // if (error.response.status === 401) {
      //   window.location.href = '/login';
      // }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
