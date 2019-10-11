import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ClientPage from './views/ClientPage.vue'
import CartPage from './components/CartPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/client',
      name: 'clientPage',
      component: ClientPage
    },
    {
      path: '/cart',
      name: 'cartPage',
      component: CartPage
    }
  ]
})
