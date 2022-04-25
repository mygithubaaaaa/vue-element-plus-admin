/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
  return true
}

export function validateUsername(rule, value, callback) {
  if (value.trim() === '') {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
export function validatePassword(rule, value, callback) {
  if (value.trim() === '') {
    callback(new Error('请输入正确的密码格式'))
  }
  if (value.length < 8) {
    callback(new Error('密码不能少于8位数字'))
  } else {
    callback()
  }
}
export function validateEmail(rule, value, callback) {
  if (value === '') {
    callback(new Error('请正确填写邮箱'))
  } else {
    if (value !== '') {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        callback(new Error('请输入有效的邮箱'))
      }
    }
    callback()
  }
}

export function validateMobilePhone(rule, value, callback) {
  if (value === '') {
    callback(new Error('手机号不可为空'))
  } else {
    if (value !== '') {
      const reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入有效的手机号码'))
      }
    }
    callback()
  }
}
