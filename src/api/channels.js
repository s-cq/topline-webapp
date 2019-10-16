import request from '@/utils/request'

// 获取用户频道列表s
export function getChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'

  })
}
// 全部频道列表
export function getAllChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
