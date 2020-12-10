import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Link',
    meta: { title: '' },
    component: () => import('@/views/link/index.vue')
  },
  {
    path: '/401',
    name: 'forbidden',
    component: () => import('@/views/401/index.vue')
  },
  {
    path: '*',
    name: 'None',
    component: () => import('@/views/404/index.vue')
  }
]

const router = new VueRouter({
  routes
})
// 捕获路由异常
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
