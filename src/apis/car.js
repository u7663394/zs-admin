// 行车管理相关接口
import request from "@/utils/request";

// 1. 获取月卡列表
export const getCardListAPI = (params) => {
  return request({
    url: "/parking/card/list",
    params,
  });
};

// 2. 添加月卡
export const createCardAPI = (data) => {
  return request({
    url: "/parking/card",
    method: "POST",
    data,
  });
};

// 3. 编辑月卡
export const updateCardAPI = (data) => {
  return request({
    url: "/parking/card/edit",
    method: "PUT",
    data,
  });
};

// 4. 获取月卡详情
export const getCardDetailAPI = (id) => {
  return request({
    url: `/parking/card/detail/${id}`,
  });
};

// 5. 删除月卡
export const delCardAPI = (id) => {
  return request({
    url: `/parking/card/${id}`,
    method: "DELETE",
  });
};
