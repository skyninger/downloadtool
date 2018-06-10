import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/page/Login'
import Main from '@/components/page/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
