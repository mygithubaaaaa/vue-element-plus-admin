import request from '@/utils/request'

export function queryGroup(name) {
  return request({
    url: '/groupUser/queryGroup',
    method: 'get',
    params: { groupName: name }
  })
}
