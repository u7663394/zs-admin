// 行车管理相关接口
import request from "@/utils/request";

// 1. 获取月卡列表
export const getCardListAPI = (params) => {
  return request({
    url: "/parking/card/list",
    params,
  });
};
