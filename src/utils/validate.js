/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUserName(username) {
  const regex = /^[a-zA-Z0-9_-]{5,30}$/;
  return regex.test(username);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validPassword(password) {
  // 正则表达式检查
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

export function validTel(phoneNumber) {
  // 正则表达式匹配中国大陆的合法手机号码
  const regex = /^(?:\+86)?1[3-9]\d{9}$/;
  return regex.test(phoneNumber);
}
