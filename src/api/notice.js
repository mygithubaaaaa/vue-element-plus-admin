import request from '@/utils/request'

export function getCreatedList(data) {
  return request({
    url: '/notice/createdList',
    method: 'post',
    data
  })
}

export function getReceivedList(data) {
  return request({
    url: '/notice/receivedList',
    method: 'post',
    data
  })
}

export function createNotice(data) {
  return request({
    url: '/notice/create',
    method: 'post',
    data
  })
}

export function deleteNotice(data) {
  return request({
    url: '/notice/delete',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/notice/update',
    method: 'post',
    data
  })
}

export function sendNotice(data) {
  return request({
    url: '/notice/sendNotice',
    method: 'post',
    data
  })
}

export function readInfo(noticeId) {
  return request({
    url: '/notice/readInfo',
    method: 'get',
    params: { noticeId: noticeId }
  })
}

export function read(noticeId) {
  return request({
    url: '/notice/read',
    method: 'get',
    params: { noticeId: noticeId }
  })
}
