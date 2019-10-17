import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/login'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login')
      // component: Login
    },
    {
      path: '/search',
      component: () => import('@/views/search')

    },
    {
      path: '/search/:p',
      component: () => import('@/views/search/searchResult')

    },
    {
      path: '/',
      component: () => import('@/views/tabbar'),
      children: [
        {
          path: '',
          component: () => import('@/views/home')
        }
      ]

    }

  ]
})
