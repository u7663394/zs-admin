import router from "@/router";
import store from "@/store";
import axios from "axios";
import { Message } from "element-ui";

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
    // 统一处理错误
    if (error.response) {
      if (error.response.status === 401) {
        router.push(`/login?redirect=${router.currentRoute.fullPath}`);
        store.commit("user/delTokens");
      }
      Message.error(error.response.data.msg);
    }
    return Promise.reject(error);
  }
);

export default service;
