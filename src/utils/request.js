import axios from 'axios'
import jsonbiginit from 'json-bigint'
import store from '@/store'
const request = axios.create({
  baseURL: ' http://ttapi.research.itcast.cn'
})
request.defaults.transformResponse = [ function (data) {
  return data ? jsonbiginit.parse(data) : {}
}]
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
}
)
export default request
