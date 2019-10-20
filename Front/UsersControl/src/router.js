import Vue from 'vue'
import Router from 'vue-router'
import Databases from './views/Databases.vue'
import Users from './views/Users.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Databases
    },
    {
      path: '/database/users',
      name: 'dbUsers',
      component: Users
    },
    {
      path: '/*',
      redirect: 'home'
    }
  ]
});