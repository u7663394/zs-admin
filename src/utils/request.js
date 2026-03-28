import store from "@/store";
import axios from "axios";

const service = axios.create({
  baseURL: "https://api-hmzs.itheima.net/tj",
  timeout: 10000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 携带 token
    store.state.user.token &&
      (config.headers.Authorization = `Bearer ${store.state.user.token}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
