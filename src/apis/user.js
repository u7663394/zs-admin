import request from '@/utils/request'

// 1. 登录函数
/**
 * @description: 登录函数
 * @param {*} data { username, password }
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

// 2. 获取用户信息
export function getProfileAPI() {
  return request({
    url: '/park/user/profile',
    method: 'GET'
  })
}