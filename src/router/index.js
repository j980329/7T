import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/admin/home.vue'
import login from '../views/admin/log.vue'
Vue.use(Router)
                // Router要和上面的Router同名
const router = new Router({
  // 使用routes路由
routes:[
  {path: '/',redirect: '/login'},
  {path: '/home',component: home},
  {path: '/login',component: login},
]
})
//路由守卫
router.beforeEach((to, from, next)=>{
  // 跳转到login 放行
  if(to.path=='/login') return next()
// 获取网络储存中的token
  const tokenSter=window.sessionStorage.getItem('token')
  // 如果没有 强制跳转到login 否则当这条不存在
  if(!tokenSter) return next('/login')
  // 放行
  next()
})

export default router
