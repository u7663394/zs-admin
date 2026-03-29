/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 1. 定义校验手机号的校验函数
export function validMobile(mobile) {
  return /^1[3-9]\d{9}$/.test(mobile);
}

// 2. 校验车牌号的校验函数
export function validCarNum(carNum) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(
    carNum
  );
}

// 3. 校验姓名校验函数
export function validChineseName(name) {
  return /^(?:[\u4e00-\u9fa5·]{2,10})$/.test(name);
}
