import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候 就先从缓存中读取
  userInfo: {} // 定义一个空对象null 因为后边我要开发userInfo的属性给别人用 UserInfo.name
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将vuex置空
    removeToken() // 同步到缓存
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo } // 用 浅拷贝的方式取赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data)
    // console.log(data)
    // console.log(result.data)
    // axios默认加了一层data

    // 如果为true  表示登录成功
    context.commit('setToken', result)
    setTimeStamp()// 将当前的最新时间写入缓存
  },

  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // result就是用户的基本资料
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    // 加一个点睛之笔  这里这一步，暂时用不到，但是请注意，这给我们后边会留下伏笔
    return baseResult
  },

  // 登出的action
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息

    resetRouter()// 重置路由
    // 去设置权限模块下路由为初始状态
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
