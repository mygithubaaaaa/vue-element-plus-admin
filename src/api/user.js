import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function sendCode(email) {
  return request({
    url: '/user/sendCode',
    method: 'post',
    data: { email: email }
  })
}

export function setUserRole(data) {
  return request({
    url: '/user/setUserRole',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function save(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}

export function pageQueryUser(data) {
  return request({
    url: '/user/pageQueryUser',
    method: 'post',
    data
  })
}
