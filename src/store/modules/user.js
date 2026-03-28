import { loginAPI } from "@/apis/user";
import { getToken, setToken } from "@/utils/auth";

export default {
  namespaced: true,
  // 1. state 用于在 Vuex 中管理 token
  state() {
    return {
      token: getToken() || "",
    };
  },
  // 2. mutation 用于在 Vuex 中设置 token
  mutations: {
    setTokens(state, newToken) {
      state.token = newToken; // 存在 Vuex 里
      setToken(newToken); // 存在 local 里
    },
  },
  // 3. action 用于在 Vuex 中发送请求拿 token，并调用 mutation 存 token
  actions: {
    async loginActions(store, data) {
      const res = await loginAPI(data);
      store.commit("setTokens", res.data.token);
    },
  },
};
