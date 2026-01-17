import axios, {type AxiosInstance } from 'axios';
import { store } from '../store/store';
import { showGlobalError } from '../utils/ErrorBridge';


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
    const token = store.getState().auth.token;// AsyncStorage, SecureStore, Redux, etc

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Error inesperado del servidor";

    showGlobalError(message);
    return Promise.reject(error);
  }
);

export { api };
