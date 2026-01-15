import axios from "axios";

const api = axios.create({
  baseURL: "https://pruebareactjs.test-class.com/Api/",
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    api.defaults.headers.common.Authorization = undefined;
  }
};

export default api;
