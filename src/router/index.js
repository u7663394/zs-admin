import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
import store from "@/store";

export const routes = [
  {
    path: "/login",
    component: () => import("@/views/Login/index"),
    hidden: false,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/workbench",
  },
  {
    path: "/workbench",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/Workbench/index"),
        // 路由元信息（给路由对象设置给多参数和值）
        meta: { title: "工作台", icon: "el-icon-data-board" },
      },
    ],
  },
  {
    // 行车管理-月卡管理-新增月卡
    path: "/add-card",
    component: () => import("@/views/Car/CarCard/addCard.vue"),
  },
  {
    // 园区管理-企业管理-新增企业
    path: "/add-ep",
    component: () => import("@/views/Park/Enterprise/add-ep.vue"),
  },
  {
    // 园区管理-企业管理-查看企业详情
    path: "/ep-detail",
    component: () => import("@/views/Park/Enterprise/detail.vue"),
  },
  {
    // 系统管理-角色管理-新增角色
    path: "/add-role",
    component: () => import("@/views/System/Role/add-role.vue"),
  },
];

// 动态路由表: RBAC 路由页面
export const asyncRoutes = [
  {
    path: "/park",
    component: Layout,
    permission: "park",
    meta: { title: "园区管理", icon: "el-icon-office-building" },
    children: [
      {
        path: "building",
        permission: "park:building",
        meta: { title: "楼宇管理" },
        component: () => import("@/views/Park/Building/index"),
      },
      {
        path: "enterprise",
        permission: "park:enterprise",
        meta: { title: "企业管理" },
        component: () => import("@/views/Park/Enterprise/index"),
      },
    ],
  },
  {
    path: "/parking",
    component: Layout,
    permission: "parking",
    meta: { title: "行车管理", icon: "el-icon-guide" },
    children: [
      {
        path: "area",
        permission: "parking:area",
        component: () => import("@/views/Car/CarArea"),
        meta: { title: "区域管理" },
      },
      {
        path: "card",
        permission: "parking:card",
        component: () => import("@/views/Car/CarCard"),
        meta: { title: "月卡管理" },
      },
      {
        path: "pay",
        permission: "parking:payment",
        component: () => import("@/views/Car/CarPay"),
        meta: { title: "停车缴费管理" },
      },
      {
        path: "rule",
        permission: "parking:rule",
        component: () => import("@/views/Car/CarRule"),
        meta: { title: "计费规则管理" },
      },
    ],
  },
  {
    path: "/pole",
    component: Layout,
    permission: "pole",
    meta: { title: "一体杆管理", icon: "el-icon-refrigerator" },
    children: [
      {
        path: "info",
        permission: "pole:info",
        component: () => import("@/views/Rod/RodManage"),
        meta: { title: "一体杆管理" },
      },
      {
        path: "waring",
        permission: "pole:warning",
        component: () => import("@/views/Rod/RodWarn"),
        meta: { title: "告警记录" },
      },
    ],
  },
  {
    path: "/sys",
    component: Layout,
    permission: "sys",
    meta: { title: "系统管理", icon: "el-icon-setting" },
    children: [
      {
        path: "role",
        permission: "sys:role",
        component: () => import("@/views/System/Role/index"),
        meta: { title: "角色管理" },
      },
      {
        path: "user",
        permission: "sys:user",
        component: () => import("@/views/System/Employee/index"),
        meta: { title: "员工管理" },
      },
    ],
  },
  {
    path: "/propety",
    component: Layout,
    permission: "property",
    children: [
      {
        // 这里路径字符串为空，代表一级菜单无二级菜单
        path: "",
        name: "cost",
        // 二级路由点，要挂载的组件
        component: () => import("@/views/Propety/index"),
        // 左侧路由上标题和图标
        meta: { title: "物业费管理", icon: "el-icon-wallet" },
      },
    ],
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', require service support
    mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes: routes,
  });

const router = createRouter();

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter();
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher;
}

const whiteList = ["/login"];
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token;
  if (token) {
    // 第一次登陆时获取用户信息(权限列表)
    if (!store.state.user.profile.id) {
      const userRoutes = [];
      // 1. 一级权限列表
      const newList = [];
      const res = await store.dispatch("user/getProfileActions");
      res.data.permissions.forEach((item) => {
        newList.push(item.split(":")[0]);
      });
      // 1.1. 数组去重
      const firstPerList = Array.from(new Set(newList));
      // 2. 匹配筛选
      const routeArr = asyncRoutes.filter((route) => {
        if (firstPerList.includes("*")) return true;
        return firstPerList.includes(route.permission);
      });
      // 3. 动态追加路由
      userRoutes.push(...routeArr);
      store.commit("user/setUserRoutes", userRoutes);
      routeArr.forEach((item) => {
        router.addRoute(item);
      });
    }
    return next();
  }
  if (whiteList.includes(to.path)) return next();
  return next("/login");
});

export default router;
