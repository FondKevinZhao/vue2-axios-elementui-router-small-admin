import Vue from 'vue'
import VueRouter from 'vue-router'
import UserList from '../components/UserList.vue'
import UserDetail from '../components/UserDetail.vue'

Vue.use(VueRouter)

// 声明路由规则
const routes = [
  // 重定向路由规则
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/users',
    component: UserList
  },
  {
    path: '/users/:id',
    component: UserDetail,
    props: true, // 给详情页面开启props传参
  }
]

const router = new VueRouter({
  routes
})

export default router
