import request from '@/utils/request'

// 登陆
export function login (data) {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}
