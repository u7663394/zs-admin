// 放置全局指令
import Vue from "vue";
import store from "@/store";

Vue.directive("auth-dir", {
  inserted(el, binding) {
    /**
     * el: 指令所在的标签
     * binding: 指令的参数
     * binding.value: 指令后面传入的数据
     */
    const perms = store.state.user.profile.permissions;
    if (perms.includes("*:*:*")) {
      // 管理员: 拥有所有权限
    } else if (!perms.includes(binding.value)) {
      // 移除按钮
      el.remove();
    }
  },
});
