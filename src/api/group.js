import request from '@/utils/request'

export function getGroupTree() {
  return request({
    url: '/group/getGroupTree',
    method: 'get'
  })
}

export function createGroup(data) {
  return request({
    url: '/group/create',
    method: 'post',
    data
  })
}

export function deleteGroup(groupId) {
  return request({
    url: '/group/delete',
    method: 'post',
    data: { groupId: groupId }
  })
}
