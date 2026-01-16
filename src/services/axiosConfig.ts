import axios, {type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: "https://pruebareactjs.test-class.com/Api/",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token, etc.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export { api };
