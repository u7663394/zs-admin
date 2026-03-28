import request from '@/utils/request'

// 登录函数
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
