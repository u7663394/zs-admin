// 系统管理相关接口
import request from "@/utils/request";

// 1. 获取角色列表
export const getRoleListAPI = () => {
  return request({
    url: "/park/sys/role",
  });
};

// 2. 获取权限点列表
export const getTreeListAPI = () => {
  return request({
    url: "/park/sys/permision/all/tree",
  });
};

// 3. 获取角色权限列表
export const getRoleDetailAPI = (roleId) => {
  return request({
    url: `/park/sys/role/${roleId}`,
  });
};

// 4. 获取成员列表
export const getRoleUserAPI = (roleId) => {
  return request({
    url: `/park/sys/roleUser/${roleId}`,
  });
};

// 5. 添加角色
export const createRoleUserAPI = (data) => {
  return request({
    url: "/park/sys/role",
    method: "POST",
    data,
  });
};

// 6. 编辑角色
export const updateRoleAPI = (data) => {
  return request({
    url: "/park/sys/role",
    method: "PUT",
    data,
  });
};

// 7. 删除角色
export const delRoleUserAPI = (roleId) => {
  return request({
    url: `/park/sys/role/${roleId}`,
    method: "DELETE",
  });
};
