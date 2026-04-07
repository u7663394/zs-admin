import { loginAPI, getProfileAPI } from "@/apis/user";
import { getToken, removeToken, setToken } from "@/utils/auth";

export default {
  namespaced: true,
  // 1. state 用于在 Vuex 中管理 token
  state() {
    return {
      token: getToken() || "",
      profile: {},
      userRoutes: [], // RBAC 路由
    };
  },
  // 2. mutation 用于在 Vuex 中设置 token
  mutations: {
    setTokens(state, newToken) {
      state.token = newToken; // 存在 Vuex 里
      setToken(newToken); // 存在 local 里
    },
    delTokens(state) {
      state.token = ""; // 清除 Vuex 里的 token
      removeToken(); // 清除本地的 token
    },
    setProfile(state, newProfile) {
      state.profile = newProfile;
    },
    delProfile(state) {
      state.profile = {};
    },
    setUserRoutes(state, newRoutes) {
      state.userRoutes = newRoutes;
    },
  },
  // 3. action 用于在 Vuex 中发送请求拿 token，并调用 mutation 存 token
  actions: {
    async loginActions(store, data) {
      const res = await loginAPI(data);
      store.commit("setTokens", res.data.token);
    },
    async getProfileActions(store) {
      const res = await getProfileAPI();
      store.commit("setProfile", res.data);
      return res;
    },
  },
};
