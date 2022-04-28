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

export function getGroupNameByInviteCode(inviteCode) {
  return request({
    url: '/group/getGroupNameByInviteCode',
    method: 'get',
    params: { inviteCode: inviteCode }
  })
}
