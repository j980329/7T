import Vue from 'vue'
import Router from 'vue-router'

import home from '../views/admin/home.vue'
import login from '../views/admin/log.vue'
import users from '../views/admin/user.vue'
import roles from '../views/admin/roles.vue'
import rights from '../views/admin/rights.vue'
import reports from '../views/admin/reports.vue'
import syy from '../views/admin/syy.vue'
import categories from '../views/admin/categories.vue'
import goods from '../views/admin/goods.vue'
import zhu from '../views/admin/zhu.vue'
import params from '../views/admin/params.vue'
import orders from '../views/admin/orders.vue'
import list from '../views/admin/list.vue'
Vue.use(Router)
// Router要和上面的Router同名
const router = new Router({
  // 使用routes路由
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/zhu', component: zhu, children: [
        { path: '/home', component: home },
        { path: '/users', component: users },
        { path: '/reports', component: reports },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/syy', component: syy },
        { path: '/categories', component: categories },
        { path: '/goods', component: list },
        { path: '/params', component: params },
{ path: '/orders', component: orders },
{ path: '/goods/add', component: goods },
      ]
    },

    { path: '/login', component: login },

  ]
})
//路由守卫
router.beforeEach((to, from, next) => {
  // 跳转到login 放行
  if (to.path == '/login') return next()
  // 获取网络储存中的token
  const tokenSter = window.sessionStorage.getItem('token')
  // 如果没有 强制跳转到login 否则当这条不存在
  if (!tokenSter) return next('/login')
  // 放行
  next()
})



export default router
