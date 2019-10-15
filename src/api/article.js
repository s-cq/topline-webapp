import request from '@/utils/request.js'
// 频道新闻推荐
export function getArticles (params) {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
