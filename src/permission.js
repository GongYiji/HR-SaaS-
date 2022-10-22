// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store' // 引入store实例 和组件中的this.$store是一回事
import nProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
// next是前置守卫必须必须执行的钩子 next必须执行 如果不执行 页面就死了
// next ()放过
// next(false)跳转终止
// next(地址)跳转到某个地址
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是 登录页
      next('/') // 跳到主页
    } else {
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        const { roles } = await store.dispatch('user/getUserInfo')
        console.log(roles)
        // 为什么要写await 因为我们想获取完资料再去放行
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        console.log(routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单

      next()
    } else {
      next('/login')// 跳到登录页
    }
    nProgress.done()// 解决手动切换地址时 进度条不关闭的问题
  }
})
// 后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})
