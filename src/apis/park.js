// 园区管理相关接口
import request from "@/utils/request";

// 1. 获取企业列表
export const getEnterpriseListAPI = (params) => {
  return request({
    url: "/park/enterprise",
    params,
  });
};

// 2. 获取行业列表
export const getIndustryListAPI = () => {
  return request({
    url: "/park/industry",
  });
};

// 3. 上传文件
export const uploadAPI = (file) => {
  return request({
    url: "/upload",
    method: "POST",
    file,
  });
};

// 3. 添加企业
export const createEnterpriseAPI = (data) => {
  return request({
    url: "/park/enterprise",
    method: "POST",
    data,
  });
};

// 4. 获取楼宇列表
export const getRentBuildListAPI = () => {
  return request({
    url: "/park/rent/building",
  });
};

// 5. 添加合同
export const createRentAPI = (data) => {
  return request({
    url: "/park/enterprise/rent",
    method: "POST",
    data,
  });
};

// 6. 获取合同列表
export const getRentListAPI = (id) => {
  return request({
    url: `/park/enterprise/rent/${id}`,
  });
};

// 7. 退租合同
export const outRentAPI = (rentId) => {
  return request({
    url: `/park/enterprise/rent/${rentId}`,
    method: "PUT",
  });
};
