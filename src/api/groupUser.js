import request from '@/utils/request'

export function queryGroup(name) {
  return request({
    url: '/groupUser/queryGroup',
    method: 'get',
    params: { groupName: name }
  })
}

export function join(inviteCode) {
  return request({
    url: '/groupUser/joinByInviteCode',
    method: 'post',
    data: { inviteCode: inviteCode }
  })
}

export function getMyGroup(data) {
  return request({
    url: '/groupUser/getMyGroup',
    method: 'post',
    data
  })
}
